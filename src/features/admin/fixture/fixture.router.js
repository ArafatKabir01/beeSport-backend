const { getAllFixtures , createSelectedFixtures, getAllFixturesWithPagination, getFixtureById, updateFixtureById, deleteFixtureById, refreashFixtureById} = require('./fixture.controllers');

const router = require('express').Router();


router.get('/byDate', getAllFixtures);
router.get('/:id', getFixtureById);
router.put('/:id', updateFixtureById);
router.patch('/refreash/:id', refreashFixtureById);
router.delete('/:id', deleteFixtureById);
router.get('/', getAllFixturesWithPagination);
router.post('/', createSelectedFixtures);

module.exports = router;
