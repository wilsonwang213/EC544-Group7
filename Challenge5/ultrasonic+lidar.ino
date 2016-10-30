unsigned long pulse_width;
unsigned long pulse_width1;
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



  delay(1000); //Delay so we don't overload the serial port
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