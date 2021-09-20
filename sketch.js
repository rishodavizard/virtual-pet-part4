var dog;
var happyDog;
var database;
var foodS;
var foodStock;
var washroom;
var bedroom;
var garden;
var gameState;
var readState;

function preload(){
  dogImg=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
  washroomImg=loadImage("Images/Wash Room.png");
  bedroomImg=loadImage("Images/Bed Room.png");
  gardenImg=loadImage("Images/Garden.png");
  milkBottle2=loadImage("Images/Milk.png");
  livingroom=loadImage("Images/Living Room.png");
}

function setup() {
  database=firebase.database();
	createCanvas(500, 500);

  foodObj = newFood

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);

  feed = createButton("Feed the dog")
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  readState=database.ref('gamestate');
  readState.on("value", function(data){
    gameState=data.val();
  }) 
}


function draw() {  
  background("yellow");

  foodObj.display();
  writeStock(foodS);

  if(foodS == 0){
    dog.addImage(happyDog);
    milkBottle2.visible=false;
  }else{
    dog.addImage(sadDog);
    milkBottle2.visible=true;
  }

  if(gameState === 1){
    dog.addImage(happyDog);
    dog.scale=0.175;
    dog.y=250;
  }

  if(gameState === 2){
    dog.addImage(sadDog);
    dog.scale=0.175;
    milkBottle2.visible=false;
    dog.y=250;
  }

  var Bath=createButton("I want to take bath")
  Bath.position(580,125)
  if(Bath.mousePressed(function(){
    gameState=3
    database.ref('/').update({'gameState':gameState})
  }))
  if(gameState === 3){
    dog.addImage(washroomImg);
    dog.scale=1;
    milkBottle2.visible=false;
  }

  var Sleep=createButton("I am very sleepy")
  Sleep.position(710,125)
  if(Sleep.mousePressed(function(){
    gameState=4
    database.ref('/').update({'gameState':gameState})
  }))
  if(gameState === 3){
    dog.addImage(bedroomImg);
    dog.scale=1;
    milkBottle2.visible=false;
  }

  var Play=createButton("Lets play!")
  Play.position(500,160)
  if(Play.mousePressed(function(){
    gameState=5
    database.ref('/').update({'gameState':gameState})
  }))
  if(gameState === 5){
    dog.addImage(livingroom);
    dog.scale=1;
    milkBottle2.visible=false;
  }

  var PlayInGarden=createButton("Lets play in park")
  PlayInGarden.position(585,160)
  if(PlayInGarden.mousePressed(function(){
    gameState=6
    database.ref('/').update({'gameState':gameState})
  }))
  if(gameState === 6){
    dog.addImage(garden);
    dog.scale=1;
    milkBottle2.visible=false;
    dog.y=175;
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed=data.val()
   });

  fill(255,255,254);
  textsize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM", 350,30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM", 350,30);
  }else{
    text("Last Feed : ", lastFed + "AM", 350,30);
  }


  if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
  }else {
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
  }

  currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
update("Hungry");
foodObj.display();}

  drawSprites();
}

function readStock(data){
  foodS=data.val();
}
function feedDog(){
    dog.addImage(happyDog);


  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function writeStock(x){
  database.ref('/').update({
    food:x
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
