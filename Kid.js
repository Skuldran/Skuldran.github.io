KID_SPRITE_LABELS = ['Kid', 'Kid2']
KID_SPRITE_LABELS_PANIC = ['Kid-Panic', 'Kid2-Panic']
KID_SPRITE_LABELS_LYING = ['Kid-Lying', 'Kid2-Lying']

class Kid {
  constructor(x, y) {
    this.x = x
    this.y = y
  
    this.direction = 0
    this.speed = 0
    this.nextActionTimer = millis()+3000+6000*random();
    
    this.spriteIndex = floor(random(2))
    this.sprite = new newSprite(KID_SPRITE_LABELS[this.spriteIndex], 0.15);
    
    this.panic = 0
    this.sprite.stop()
    
    this.unconscious = false;
  }
  
  tick()  {
    if (this.unconscious) 
      return;
    
    
    if (this.panic < 3){
      if (millis() > this.nextActionTimer) {
        if (this.speed == 0) {
          this.direction = 2*PI*random();
          this.direction = atan2(player.y-this.y, player.x-this.x)
          this.speed = 2;
        
          let temp = dirToIndex(this.direction)
          //this.sprite.setAnimation(temp[0])
          this.sprite.flip = temp[1]
          this.sprite.setAnimation(temp[0])
          this.sprite.play()
        } else {
          this.speed = 0;
          this.sprite.stop()
        }
      
        this.nextActionTimer = millis()+3000+6000*random();
        this.panic = max(this.panic-1, 0)
      }  
    } else {
      if (millis() > this.nextActionTimer) {
        
        let dx = this.x-player.x
        let dy = this.y-player.y
        this.direction = atan2(dy, dx)
        this.speed = 3

        
        let temp = dirToIndex(this.direction)
        this.sprite.setAnimation(temp[0])
        this.sprite.flip = temp[1]
        this.sprite.setAnimation(temp[0])
        this.sprite.play()
        
        this.panic -= 1
        if (this.panic < 3) {
          this.sprite = new newSprite(KID_SPRITE_LABELS[this.spriteIndex], 0.15)
          this.nextActionTimer = millis()
        } else {
          playSound('Long Scream', min(50000/(dx*dx+dy*dy), 1), 1)
          this.nextActionTimer = millis()+3000+6000*random();
        }
        
      }
    } 
    
    
    this.x += this.speed*cos(this.direction)
    this.y += this.speed*sin(this.direction)
    
    TRASHROOM.collideObject(this)
    this.x = constrain(this.x, -1000, 1000)
    this.y = constrain(this.y, -1000, 1000)
  }
  
  knockout() {
    this.unconscious = true;
    this.sprite = new newSprite(KID_SPRITE_LABELS_LYING[this.spriteIndex], 1)
    let temp = dirToIndex(this.direction)
    //this.sprite.setAnimation(temp[0])
    this.sprite.flip = temp[1]
    this.sprite.setAnimation(temp[0])
    this.speed = 0;
  }
  
  addPanic(p) {
    if (this.unconscious)
      return;
    
    //print('Panic: ' + p)
    let oldPanic = this.panic
    this.panic = min(this.panic+p, 7)
    
    if (this.panic >= 3 && oldPanic < 3) {
      this.panic += 1
      this.sprite = new newSprite(KID_SPRITE_LABELS_PANIC[this.spriteIndex], 0.15)
      //this.sprite.play()
      this.nextActionTimer = millis()
    }
  }
  
  show() {
    //print('show')
    this.sprite.show(this.x-PAN_X, this.y-PAN_Y);
  }
  
  getDepth() {
    return -this.y
  }
}

