#include <Time.h>
int speedsensor = 3;
int val =0;
double tst = 0;
double ted =0;
bool flag =0;
double period =0;
double cons=20.00; // bow length of a fan
double circumference = 90.00;   // circumference of the wheel
double s =0;
double v = 0;

SoftwareSerial XBee(2, 3); // RX, TX

void setup() {
  Serial.begin(9600);
  XBee.begin(9600);
  val = digitalRead(speedsensor);
  //t = millis();
}

void loop() {
    int in = digitalRead(speedsensor);   // read the input pin
    if (val != in) {
        if(flag == 0) {
            val = in;
            tst = millis();
              
            flag = 1;
        }
        else {
            val = in;
            ted = millis();
             
            speed(tst, ted);
            flag=0;
        }
    }
}

void speed(time_t tst, time_t ted) {
    period = (ted - tst) / 1000.00;
     
    v = cons / period;
   
    s = (circumference / (cons * 4)) * v;
    XBee.println("Speed");
    XBee.println(s);
}
