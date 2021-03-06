#include <Time.h>
#include <PID_v1.h>
#include <Servo.h>
#include<SoftwareSerial.h>

Servo wheels; // servo for turning the wheels
Servo esc; // not actually a servo, but controlled like one!
SoftwareSerial XBee(2, 3); // RX, TX

bool startup = true; // used to ensure startup only happens once
int startupDelay = 1000; // time to pause at each calibration step
double maxSpeedOffset = 45; // maximum speed magnitude, in servo 'degrees'
double maxWheelOffset = 85; // maximum wheel turn magnitude, in servo 'degrees'

time_t t = 0;
int pinVal = 0;
int WSpin = 13;
int cmnd = 49; //Command to start/stop the car remotely

int l_0,Fl_0 ;
int l_1;
int dist,Firstdist;
double setPt, Input, Output;
int Kp = 1.8;     // initial 2
int Ki = 0.05;  // initial 0.05
int Kd = 0.5;   // initial 0.5

int inchesLast_1 = 0;
int inchesLast_2 = 0;

PID PIDleft(&Input, &Output, &setPt, Kp, Ki, Kd, DIRECT);



unsigned long pulse_width;
unsigned long pulse_width1;
unsigned long pulse_width_difference;
const int pwPin = 7;
int arraysize = 9;
int rangevalue[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0};
long pulse;
int modE;

void setup()
{
  Serial.begin(9600); // Start serial communications
  pinMode(2, OUTPUT); // Set pin 2 as trigger pin
  pinMode(3, INPUT); // Set pin 3 as monitor pin
  digitalWrite(2, LOW); 
  pinMode(4, OUTPUT); // Set pin 2 as trigger pin
  pinMode(5, INPUT); // Set pin 3 as monitor pin
  digitalWrite(4, LOW);//  

  XBee.begin(9600);
  wheels.attach(8); // initialize wheel servo to Digital IO Pin #8
  esc.attach(9); // initialize ESC to Digital IO Pin #9
  /*  If you're re-uploading code via USB while leaving the ESC powered on, 
   *  you don't need to re-calibrate each time, and you can comment this part out.
   */
  calibrateESC();


  //set initial 
  setPt = 0;
  PIDleft.SetOutputLimits(-10,10);
  PIDleft.SetMode(AUTOMATIC);

  esc.write(80);
  wheels.write(270);
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

  pinMode(pwPin, INPUT);
  for(int i = 0; i < arraysize; i++)
  {                    
    pulse = pulseIn(pwPin, HIGH);
    rangevalue[i] = pulse/58;
    delay(10);
  }
  // Serial.print("Unsorted: ");
  isort(rangevalue,arraysize);
  // Serial.print("Sorted: ");
  modE = mode(rangevalue,arraysize);
  Serial.print("The mode/median is: ");
  Serial.print(modE);
  Serial.println();

  if (modE<=30)
  {
    esc.write(90);
  }
  else
  {

    pulse_width_difference = pulse_width - pulse_width1;
    Input = pulse_width_difference;
    PIDleft.Compute();
    wheels.write(270+Output);
  }  
  

  delay(1000); //Delay so we don't overload the serial port
}

/* Calibrate the ESC by sending a high signal, then a low, then middle.*/
void calibrateESC(){
    esc.write(180); // full backwards
    delay(startupDelay);
    esc.write(0); // full forwards
    delay(startupDelay);
    esc.write(90); // neutral
    delay(startupDelay);
    esc.write(90); // reset the ESC to neutral (non-moving) value
}

void isort(int *a, int n){
// *a is an array pointer function
  for (int i = 1; i < n; ++i)
  {
    int j = a[i];
    int k;
    for (k = i - 1; (k >= 0) && (j < a[k]); k--)
    {
      a[k + 1] = a[k];
    }
    a[k + 1] = j;
  }
}

int mode(int *x,int n){

  int i = 0;
  int count = 0;
  int maxCount = 0;
  int mode = 0;
  int bimodal;
  int prevCount = 0;
  while(i<(n-1)){
    prevCount=count;
    count=0;
    while(x[i]==x[i+1]){
      count++;
      i++;
    }
    if(count>prevCount&count>maxCount){
      mode=x[i];
      maxCount=count;
      bimodal=0;
    }
    if(count==0){
      i++;
    }
    if(count==maxCount){//If the dataset has 2 or more modes.
      bimodal=1;
    }
    if(mode==0||bimodal==1){//Return the median if there is no mode.
      mode=x[(n/2)];
    }
    return mode;
  }
}
