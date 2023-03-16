const router = require('express').Router();
const upload = require('../multer/upload');
const verify = require('../routes/verification');
const Video = require('../model/Videos');
const uuid = require('uuid').v4;
const fs = require('fs')

router.post('/upload', verify , (req,res) => {

    //TODO:- Validation Needed to be performed...
    upload(req, res, async (error) => {
        if(error){
            return res.status(400).json({message : error.message});
        }   

        if(req.file === undefined){
            return res.json({message : "Upload a valid file"});
        }

        try {
    
            const new_video = new Video({
                video_id : uuid(),
                user_id : req.user.id,
                title : req.body.title,
                description : req.body.description,
                filename : req.file.filename,
                category : req.body.category
            })
    
            await new_video.save();
            return res.json({message : "Files uploaded"});
    
        } catch (err) {
            console.log(err);
        }

    });
    

});

router.post('/video_category', async (req, res) => {

    const category = req.body.category;

    console.log(category);


    try{

        Video.find({category : category}, (err, result) => {
            
            if(err){
                return console.log(err);
            }

           const responseArray = shuffleArray(result);

            return res.json(responseArray);

        });

    } catch(err){
        console.log(err);
    }

});

router.get("/video", (req, res) => {

    const clientAgent = req.useragent

    // For iPhone -> AppleCoreMedia

    if(!clientAgent.isMobile) {
        return res.json({message : "File Not Found."}).status(404);
    }

    const file_name = req.query.load;

    fs.readdir('./uploads', (err , files) => {

        if(err){
            return console.log(err);
        }

        const path = `./uploads/${file_name}`
        const stat = fs.statSync(path)
        const fileSize = stat.size
        const range = req.headers.range
    
        if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1
    
        if(start >= fileSize) {
            res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
            return
        }
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head)
        file.pipe(res)
        } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
        }

    });  

});



// Helper Functions
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
    
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));
                    
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
 }

module.exports = router;
