
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include "secrets.h"

// MOBILE HOTSPOT
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;
// SUPABASE
const char* supabaseUrl = "https://djvszoqsoxuuiurvxany.supabase.co";
const char* supabaseKey = "sb_publishable_yKOlVPcS19bbDeTuRT9CNA_O1LHyTS6";


// TWO SENSORS
const int trigPins[2] = {25, 27};
const int echoPins[2] = {26, 32};

// Empty bottle calibration
const float MAX_HEIGHT[2] = {7.43, 7.75};

const int yellowLED = 13;
const int redLED = 14;

float waterLevels[2] = {0, 0};


float measureDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(3);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000UL);

  if (duration == 0) {
    return -1;
  }

  float distance = duration * 0.0343 / 2.0;

  // Reject unreliable readings below 2 cm
  if (distance < 2.0) {
    return -1;
  }

  return distance;
}

float calculateWaterHeight(float distance, int index) {
  if (distance < 0) return -1;

  float height = MAX_HEIGHT[index] - distance;

  return constrain(height, 0.0, MAX_HEIGHT[index]);
}

void sendToSupabase(int sensorId, float waterCm, String status) {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Cannot upload.");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure(); // Prototype testing only

  HTTPClient http;

  String url = String(supabaseUrl) +
               "/rest/v1/sensor_readings";

  if (!http.begin(client, url)) {
    Serial.println("Could not start HTTP connection");
    return;
  }

  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization",
                 String("Bearer ") + supabaseKey);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");

  String payload =
    "{\"sensor_id\":" + String(sensorId) +
    ",\"water_level_cm\":" + String(waterCm, 2) +
    ",\"status\":\"" + status + "\"}";

  int responseCode = http.POST(payload);

  Serial.print("Sensor ");
  Serial.print(sensorId);
  Serial.print(" Supabase response: ");
  Serial.println(responseCode);

  if (responseCode < 200 || responseCode >= 300) {
    Serial.println(http.getString());
  }

  http.end();
}

void setup() {

  Serial.begin(115200);

  for (int i = 0; i < 2; i++) {
    pinMode(trigPins[i], OUTPUT);
    pinMode(echoPins[i], INPUT);
  }

  pinMode(yellowLED, OUTPUT);
  pinMode(redLED, OUTPUT);

  digitalWrite(yellowLED, LOW);
  digitalWrite(redLED, LOW);

  Serial.println("Connecting to mobile hotspot...");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.println(WiFi.localIP());
}

void loop() {

  float highestLevel = 0;

  for (int i = 0; i < 2; i++) {

    float distance =
      measureDistance(trigPins[i], echoPins[i]);

    float height =
      calculateWaterHeight(distance, i);

    waterLevels[i] = height;

    Serial.print("Sensor ");
    Serial.print(i + 1);
    Serial.print(" | Distance: ");

    if (distance < 0) {
      Serial.println("No echo | No upload");
    } else {

      float percentage =
        (height / MAX_HEIGHT[i]) * 100.0;

      Serial.print(distance);
      Serial.print(" cm | Water height: ");
      Serial.print(height);
      Serial.print(" cm | Level: ");
      Serial.print(percentage);
      Serial.println("%");

      if (percentage > highestLevel) {
        highestLevel = percentage;
      }

      String status = "NORMAL";

      if (percentage >= 65) {
        status = "CRITICAL";
      }
      else if (percentage >= 40) {
        status = "WARNING";
      }

      sendToSupabase(i + 1, height, status);
    }

    delay(200);
  }

  if (highestLevel >= 65) {
    digitalWrite(redLED, HIGH);
    digitalWrite(yellowLED, LOW);
  }
  else if (highestLevel >= 40) {
    digitalWrite(redLED, LOW);
    digitalWrite(yellowLED, HIGH);
  }
  else {
    digitalWrite(redLED, LOW);
    digitalWrite(yellowLED, LOW);
  }

  Serial.println("-----------------------------");

  delay(5000);
}
