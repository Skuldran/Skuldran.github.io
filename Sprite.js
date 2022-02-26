spriteArray = [];

function loadSprite(fileName, label, frameWidth, frameHeight, anchorX, anchorY, scl){
  
  loadImage(fileName, im => {
    spr = new loadedSprite(im, label, frameWidth, frameHeight, anchorX, anchorY, scl)
    spriteArray.push(spr)
    print('Loaded: ' + label)
  });
  
  
}

function writeColor(img_d, xd, yd, img_src, xs, ys) {
  let index_d = 4*(xd + yd*img_d.width)
  let index_s = 4*(xs + ys*img_src.width)
  
  img_d.pixels[index_d]   = img_src.pixels[index_s];
  img_d.pixels[index_d+1] = img_src.pixels[index_s+1];
  img_d.pixels[index_d+2] = img_src.pixels[index_s+2];
  img_d.pixels[index_d+3] = img_src.pixels[index_s+3];
}

function dirToIndex(r) {
  r = -r
  var i = (2*r/QUARTER_PI+16) % 16;
  if (i >= 15 || i < 1) {
    return [2, false]
  } else if (i >= 1 && i < 3) {
    return [1, false]
  } else if (i >= 3 && i < 5) {
    return [0, false]
  } else if (i >= 5 && i < 7) {
    return [1, true]
  } else if (i >= 7 && i < 9) {
    return [2, true]
  } else if (i >= 9 && i < 11) {
    return [3, true]
  } else if (i >= 11 && i < 13) {
    return [4, false]
  } else if (i >= 13 && i < 15) {
    return [3, false]
  } else {
    
  }
}

class loadedSprite {
  
  constructor(im, label, frameWidth, frameHeight, anchorX, anchorY, scl) {
    im.loadPixels();
    this.img = createImage(im.width*scl, im.height*scl);
    this.img.loadPixels()
    for (let i=0; i < im.width; i++) {
      for (let j=0; j < im.height; j++) {
        for (let x=0; x < scl; x++) {
          for (let y=0; y < scl; y++) {
            writeColor(this.img, i*scl+x, j*scl+y, im, i, j);
          }
        }
      }
    }
    
    this.img.updatePixels()
    
    this.label = label;
    this.frameWidth = frameWidth*scl
    this.frameHeight = frameHeight*scl
    this.anchorX = anchorX*scl
    this.anchorY = anchorY*scl
    
    this.animLength = im.width/frameWidth;
    this.animNums = im.height/frameHeight;
  }
  
  show(x, y, id, frame) {
    let pic = this.img.get(this.frameWidth*frame, this.frameHeight*id, this.frameWidth, this.frameHeight)
    image(pic, x-this.anchorX, y-this.anchorY)
  }
}

class newSprite {
  
  constructor(label, animTime) {
      for (let i = 0; i < spriteArray.length; i++) {
      if (label == spriteArray[i].label) {
        this.sprite = spriteArray[i];
        break;
      }
    }
    
    this.animation_index = 0;
    this.frame_index = 0;
    this.animationTime = 1000*animTime/this.sprite.animLength;
    
    this.isPlaying = false;
    this.flip = false
  }
  
  play() {
    if (this.isPlaying == false) {
      this.lastAnimationTime = millis();
    }
    this.isPlaying = true;
    
  }
  
  stop() {
    this.isPlaying = false;
    this.frame_index = 0;
  }
  
  setAnimation(id) {
    this.animation_index = id
  }
  
  setFrame(id) {
    this.frame_index = id
  }
  
  show(x, y){
    if (this.isPlaying && millis() > this.lastAnimationTime+this.animationTime) {
      this.frame_index = (this.frame_index+1) % this.sprite.animLength;
      this.lastAnimationTime = millis()
    }
    
    if (this.flip) {
      push()
      scale(-1, 1)
      this.sprite.show(-x, y, this.animation_index, this.frame_index)
      pop()
    } else {
      //print(x + ' : ' + y)
      this.sprite.show(x, y, this.animation_index, this.frame_index)
    }
  }
}