
//const prompt = require('prompt');
const Jimp  = require('jimp');


let size = 4;
let path = './kitten.jpg'


Jimp.read(path, (err, imgFile)=>{
    if(err){
        console.log(`Error: ${err}`);
    }

    let img = imgFile.clone();
    let width = img.bitmap.width;
    let height = img.bitmap.height;

    //console.log(`Width: ${width}, Height: ${height}`);
    let total_pixels = height*width;


    for(let y = 0; y < height-1; y++){
        for(let x = 1; x < width-1 ; x++){
            let rgba = Jimp.intToRGBA(img.getPixelColor(x,y));
            let newColor = find_closest_color(rgba, 4);
            img.setPixelColor(Jimp.rgbaToInt(newColor.r, newColor.g, newColor.b, newColor.a), x, y);
            let err = {r: rgba.r-newColor.r, g: rgba.g-newColor.g, b: rgba.b-newColor.b, a: rgba.a};
            if(x == width - 1 || y == height -1){
                continue;
            }

            //error diffusion
            let rightRgba = Jimp.intToRGBA(img.getPixelColor(x+1, y));
            let newRightRgba = find_closest_color({r: rightRgba.r+err.r*(7/16), g: rightRgba.g+err.g*(7/16), b: rightRgba.b+err.b*(7/16), a: rightRgba.a}, size);
            img.setPixelColor(Jimp.rgbaToInt(newRightRgba.r, newRightRgba.g, newRightRgba.b, rightRgba.a), x+1, y);


            let bLeftRgba = Jimp.intToRGBA(img.getPixelColor(x-1, y+1));
            let newBLeftRgba = find_closest_color({r: bLeftRgba.r+err.r*(3/16), g: bLeftRgba.g+err.g*(3/16), b: bLeftRgba.b+err.b*(3/16), a: bLeftRgba.a}, size);
            img.setPixelColor(Jimp.rgbaToInt(newBLeftRgba.r, newBLeftRgba.g, newBLeftRgba.b, bLeftRgba.a), x-1, y+1);


            let downRgba = Jimp.intToRGBA(img.getPixelColor(x, y+1));
            let newDownRgba = find_closest_color({r: downRgba.r+err.r*(5/16), g: downRgba.g+err.g*(5/16), b: downRgba.b+err.b*(5/16), a: downRgba.a}, size);
            img.setPixelColor(Jimp.rgbaToInt(newDownRgba.r, newDownRgba.g, newDownRgba.b, newDownRgba.a), x, y+1);


            let bRightRgba = Jimp.intToRGBA(img.getPixelColor(x+1, y+1));
            let newBRightRgba = find_closest_color({r: bRightRgba.r+err.r*(1/16), g: bRightRgba.g+err.g*(1/16), b: bRightRgba.b+err.b*(1/16), a: bRightRgba.a}, size);
            img.setPixelColor(Jimp.rgbaToInt(newBRightRgba.r, newBRightRgba.g, newBRightRgba.b, bRightRgba.a), x+1, y+1);


            
        }
    }
    




    img.writeAsync('clone.jpg')
        .catch((err)=>{
            throw err;
        })
        .then(()=>{
            console.log('Img written to clone.jpg');
            process.exit(0);
        });
});



 function find_closest_color(pxlColor, size){
     //color= {r,g,b,a}
    //function divides 0-255 into "size" parts
    let newR, newG, newB;
    
    newR = Math.round(Math.round(size*pxlColor.r/255) * (255/size));
    newG = Math.round(Math.round(size*pxlColor.g/255) * (255/size));
    newB = Math.round(Math.round(size*pxlColor.b/255) * (255/size));

    return {r: newR, g: newG, b: newB, a: pxlColor.a};
 }