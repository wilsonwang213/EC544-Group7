unsigned long pulse_width;
unsigned long pulse_width1;

void setup()
{
  Serial.begin(9600); // Start serial communications
  pinMode(2, OUTPUT); // Set pin 2 as trigger pin
  pinMode(3, INPUT); // Set pin 3 as monitor pin
  digitalWrite(2, LOW); 
  pinMode(4, OUTPUT); // Set pin 2 as trigger pin
  pinMode(5, INPUT); // Set pin 3 as monitor pin
  digitalWrite(4, LOW);//  
}

void loop()
{
  pulse_width = pulseIn(3, HIGH); // Count how long the pulse is high in microseconds
  if(pulse_width != 0){ // If we get a reading that isn't zero, let's print it
        pulse_width = pulse_width/10; // 10usec = 1 cm of distance for LIDAR-Lite
    Serial.print("pulse 1: ");
    Serial.println(pulse_width); // Print the distance
  }
  pulse_width1 = pulseIn(5, HIGH); // Count how long the pulse is high in microseconds
  if(pulse_width1 != 0){ // If we get a reading that isn't zero, let's print it
       pulse_width1 = pulse_width1/10; // 10usec = 1 cm of distance for LIDAR-Lite
     Serial.print("pulse 2: ");
    Serial.println(pulse_width1); // Print the distance
  }
  delay(1000); //Delay so we don't overload the serial port
}
