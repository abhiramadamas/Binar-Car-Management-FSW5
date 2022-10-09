const router = require('express').Router();
const {Cars} = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

//GET users listing
router.get('/', async (req, res) => {
    const cars = await Cars.findAll({order: [['id', 'ASC']]});
    res.json({
        status: 200,
        message: 'Success',
        data: cars
    });
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    //check id in table cars
    let car = await Cars.findByPk(id);
    if (!car){
        return res.status(404).json({status:400 , message: "No data found"});
    } else {
        return res.json({status:200 , message: "success", data: car});
    }
});

// post 
router.post('/', async (req, res) => {
    // console.log(req);
    console.log(req.files.img)
    if(!req.files) return res.status(400).json({msg: "no file uploaded"});
    const nama = req.body.nama;
    const sewa = parseInt(req.body.sewa);
    const ukuran = req.body.ukuran;
    const file = req.files.img;
    const fileSize = file.size
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.jpg','.jpeg','.png'];

    const schema = {
        nama: {type: "string"},
        sewa: {type: "number"},
        ukuran: {type: "string"},
        img: {type: "string"}
    };
    const validate = v.compile(schema);
    const valid = validate({nama: nama, sewa: sewa, ukuran: ukuran, img: url});
    if(valid){
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "invalid images"});
        if(fileSize > 2000000) return res.status(422).json({msg: "size must be less than 2 MB"});

        file.mv(`./public/images/${fileName}`, async(err)=>{
            if(err) return res.status(500).json({msg: err.message});
            try {
                await Cars.create({nama: nama, sewa: sewa, ukuran: ukuran, img: url});
                res.status(201).json({msg: "cars created"});
            } catch (error) {
                console.log(error.message);
            }
        })
    }
    else res.status(400).json({error: valid});
});

//put
router.put('/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    if(!car){
        return res.status(404).json({msg: "no data"});
    }
    let url;
    let nama;
    let sewa;
    let ukuran;
    let fileName;
    let ext = '';
    let fileSize;
    let file;
    let allowedType = [,'.jpg','.jpeg','.png'];

    if(req.files){
        file = req.files.img;
        fileSize = file.size
        ext = path.extname(file.name);
        fileName = file.md5 + ext;
        url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }
    else url = car.img;

    if(req.body.nama) {
        nama = req.body.nama;
    } else nama = car.nama;

    if(req.body.sewa) {
        sewa = parseInt(req.body.sewa);
    } else sewa = car.sewa;

    if(req.body.ukuran){
        ukuran = req.body.ukuran;
    } else ukuran = car.ukuran;
        
    const schema = {
        nama: {type: "string"},
        year: {type: "number"},
        ukuran: {type: "string"},
        img: {type: "string"}
    };
    const validate = v.compile(schema);
    const valid = validate({nama: nama, sewa: sewa, ukuran: ukuran, img: url});
    if(valid){
        if(req.files){
            if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "invalid images"});
            if(fileSize > 2000000) return res.status(422).json({msg: "size must be less than 2MB"});
            file.mv(`./public/images/${fileName}`, async(err)=>{
                if(err) return res.status(500).json({msg: err.message});
                try {
                    await Cars.update({nama: nama, sewa: sewa, ukuran: ukuran, img: url}, {where: {id: req.params.id}});
                    res.status(201).json({msg: "cars updated"});
                } catch (error) {
                    console.log(error.message);
                }
            })
        }
        else{
            try {
                await Cars.update({nama: nama, sewa: sewa, ukuran: ukuran, img: url}, {where: {id: req.params.id}});
                res.status(201).json({msg: "Cars Updated Successfuly"});
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    else res.status(400).json({error: valid});
});

//delete 
router.delete('/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    const fileName = car.img.split("/").pop();
    const filepath = `./public/images/${fileName}`;
    const msg = await Cars.destroy({where: {id: req.params.id}});
    res.json(msg);
});

//post by view
router.post('/postCar', async (req, res) => {
    console.log(req);
    if(!req.files) return res.status(400).json({msg: "no file uploaded"});
    const nama = req.body.nama;
    const sewa = parseInt(req.body.sewa);
    const ukuran = req.body.ukuran;
    const file = req.files.img;
    const fileSize = file.size
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.jpg','.jpeg','.png'];

    const schema = {
        nama: {type: "string"},
        sewa: {type: "number"},
        ukuran: {type: "string"},
        img: {type: "string"}
    };
    const validate = v.compile(schema);
    const valid = validate({nama: nama, sewa: sewa, ukuran: ukuran, img: url});
    if(valid){
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "invalid images"});
        if(fileSize > 2000000) return res.status(422).json({msg: "size must be less than 2 MB"});
        file.mv(`./public/images/${fileName}`, async(err)=>{
            if(err) return res.status(500).json({msg: err.message});
            try {
                await Cars.create({nama: nama, sewa: sewa, ukuran: ukuran, img: url});
                res.redirect('/saved')
            } catch (error) {
                console.log(error.message);
            }
        })
    }
    else res.status(400).json({error: valid});
});

//put by view
router.post('/updateCar/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    if(!car){
        return res.status(404).json({msg: "no data"});
    }
    let url;
    let nama;
    let sewa;
    let ukuran;
    let fileName;
    let ext = '';
    let fileSize;
    let file;
    let allowedType = [,'.jpg','.jpeg','.png'];
    if(req.files){
        file = req.files.img;
        fileSize = file.size
        ext = path.extname(file.name);
        fileName = file.md5 + ext;
        url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }
    else url = car.img;

    if(req.body.nama) {
        nama = req.body.nama;
    } else nama = car.nama;

    if(req.body.sewa) {
        sewa = parseInt(req.body.sewa);
    } else sewa = car.sewa;

    if(req.body.ukuran){
        ukuran = req.body.ukuran;
    } else ukuran = car.ukuran;
        
    const schema = {
        nama: {type: "string"},
        year: {type: "number"},
        ukuran: {type: "string"},
        img: {type: "string"}
    };
    const validate = v.compile(schema);
    const valid = validate({nama: nama, sewa: sewa, ukuran: ukuran, img: url});
    if(valid){
        if(req.files){
            if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "invalid images"});
            if(fileSize > 2000000) return res.status(422).json({msg: "size must be less than 2MB"});
            file.mv(`./public/images/${fileName}`, async(err)=>{
                if(err) return res.status(500).json({msg: err.message});
                try {
                    await Cars.update({nama: nama, sewa: sewa, ukuran: ukuran, img: url}, {where: {id: req.params.id}});
                    res.redirect('/saved');
                } catch (error) {
                    console.log(error.message);
                }
            })
        }
        else{
            try {
                await Cars.update({nama: nama, sewa: sewa, ukuran: ukuran, img: url}, {where: {id: req.params.id}});
                res.redirect('/saved');
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    else{
        res.status(400).json({error: valid});
    }
});

//delete by view
router.get('/deleteCar/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    const fileName = car.img.split("/").pop();
    const filepath = `./public/images/${fileName}`;
    const msg = await Cars.destroy({where: {id: req.params.id}});
    res.redirect("/");
});

module.exports = router;