class Trashroom {
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
  
    
    this.width = 30*5 //IN both directions
    this.height = 20*5
      
    this.sprite = new newSprite('Trashroom', 1)
  
    this.input = []
  }
  
  keyTyped(key) {
    let dx = player.x-this.x;
    let dy = player.y-this.y;
    
    if (sqrt(dx*dx+dy*dy) > 80) {
      return;
    }
    
    let elite = [1,3,3,7]
    if ([0,1,2,3,4,5,6,7,8,9].some(x => str(x)==key)) {
      this.input.push(key)
      playSound('BEEP')
      
      if (this.input.length == code.length) {        
        if (this.input.every((x, i) => x==code[i])) {
          playSound('BEEP-YES')
          
          score += 100*player.bagage;
          player.bagage = 0;
        } else if (this.input.every((x, i) => x==elite[i])) {
          playSound('1337', 2)
        } else {
          playSound('BEEP-NO')
        }
        
        this.input = []
      }
    }
  }
  
  tick() {
    
  }
  
  show() {
    //fill(new Color(255, 0, 0))
    
    this.sprite.show(this.x-PAN_X, this.y-PAN_Y)
  }
  
  getDepth() {
    return -this.y
  }
  
  collideObject(obj) {
    let ix = this.width-abs(obj.x-this.x);
    let iy = this.height/2-abs(obj.y-this.y+this.height/2)
    
    if (ix > 0 && iy > 0) {
      if (ix < iy) {
        obj.x<this.x ? obj.x=this.x-this.width : obj.x=this.x+this.width;
      } else {
        obj.y<this.y-this.height/2 ? obj.y=this.y-this.height: obj.y=this.y
      }
    }
  }
}

