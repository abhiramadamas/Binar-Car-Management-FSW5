const express = require('express');
const router = express.Router();
const {Cars} = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['nama', 'ASC']]});
    res.render('pages/index', { cars: cars, filter: "all", save:""});
});

/* GET home page. saved */
router.get('/saved', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['nama', 'ASC']]});
    res.render('pages/index', { cars: cars, filter: "all", save:"success"});
});

//filter
/* GET Small */
router.get('/small', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['nama', 'ASC']], where: {ukuran: 'Small'}});
    res.render('pages/index', { cars: cars, filter: "small",  save:""});
});

/* GET Medium */
router.get('/medium', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['nama', 'ASC']], where: {ukuran: 'Medium'}});
    res.render('pages/index', { cars: cars, filter: "medium",  save:""});
});

/* GET Large */
router.get('/large', async function(req, res, next) {
    const cars = await Cars.findAll({order: [['nama', 'ASC']], where: {ukuran: 'Large'}});
    res.render('pages/index', { cars: cars, filter: "large",  save:""});
});

/* GET add page. */
router.get('/add', function(req, res, next) {
    res.render('pages/add-page', { title: 'Express' });
});

/* GET update page. */
router.get('/update/:id', async function(req, res, next) {
    const car = await Cars.findByPk(req.params.id);
    // console.log(car)
    if(!car){
        return res.status(404).json({msg: "No Data Found"});
    }
    res.render('pages/update-page', { Cars: car });
});

module.exports = router;