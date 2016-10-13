var
  express = require('express'),
  router = express.Router(),
  utils = require.main.require('./server/utils'),
  conditions = [
    {
      cui: "C0000731",
      label: "Abdominal bloating",
      synonyms: [
        "Abdomen feels bloated",
        "Abdominal distension",
        "Swollen abdomen",
        "Meteorism",
        "Bloat",
        "Bloating",
        "Swelling of abdomen",
        "Bloated abdomen",
        "Abdominal distention",
        "Abdominal swelling",
        "Abdomen distended",
        "bloated",
        "gassiness",
        "Bloating symptom"
      ]
    },
    {
      cui: "C0000734",
      label: "Abdominal mass",
      synonyms: [ ]
    },
    {
      cui: "C0000737",
      label: "Abdominal pain",
      synonyms: [
        "AP"
      ]
    },
    {
      cui: "C0000786",
      label: "Miscarriage",
      synonyms: [ ]
    },
    {
      cui: "C0000833",
      label: "Abscess",
      synonyms: [
        "Abscess morphology",
        "Abcess",
        "Absess",
        "abscessed",
        "abscesses"
      ]
    },
    {
      cui: "C0000833",
      label: "Abscess",
      synonyms: [
        "Abscess morphology",
        "Abcess",
        "Absess",
        "abscessed",
        "abscesses"
      ]
    },
    {
      cui: "C0001206",
      label: "Acromegaly",
      synonyms: [
        "Growth hormone hypersecretion syndrome",
        "STH hypersecretion syndrome",
        "Anterior pituitary adenoma syndrome",
        "Acromegalia"
      ]
    },
    {
      cui: "C0001261",
      label: "Actinomycotic infection",
      synonyms: [
        "Actinomycosis",
        "Actinomycoses",
        "Actinomyces Infections"
      ]
    },
    {
      cui: "C0001288",
      label: "Activity of daily living",
      synonyms: [ ]
    },
    {
      cui: "C0001403",
      label: "Addison's disease",
      synonyms: [
        "Addison disease",
        "Primary adrenocortical insufficiency",
        "Primary hypoadrenalism",
        "Adison's disease",
        "hypocorticism",
        "adrenal cortex dysplasia",
        "Bronzed disease",
        "adrenal cortex dysfunction",
        "adrenal cortex insufficiency",
        "Melasma addisonii",
        "Adrenal storm",
        "Primary adrenal deficiency",
        "Suppression adrenal",
        "Adrenal Suppresion",
        "adrenal insufficiency"
      ]
    },
    {
      cui: "C0001403",
      label: "Addison's disease",
      synonyms: [
        "Addison disease",
        "Primary adrenocortical insufficiency",
        "Primary hypoadrenalism",
        "Adison's disease",
        "hypocorticism",
        "adrenal cortex dysplasia",
        "Bronzed disease",
        "adrenal cortex dysfunction",
        "adrenal cortex insufficiency",
        "Melasma addisonii",
        "Adrenal storm",
        "Primary adrenal deficiency",
        "Suppression adrenal",
        "Adrenal Suppresion",
        "adrenal insufficiency"
      ]
    },
    {
      cui: "C0001622",
      label: "Adrenocortical hyperfunction",
      synonyms: [
        "Disorder of corticoadrenal overactivity",
        "Hypercortisolism",
        "Cushing's syndrome",
        "Cushing's syndrome III",
        "Overproduction of cortisol",
        "Suprarenogenic syndrome",
        "Hypercorticism",
        "Itsenko-Cushing syndrome",
        "Itsenko disease",
        "Cusshing's syndrome",
        "Hyperadrenalism",
        "hypercortisolemia",
        "Hyperadrenalcorticalism",
        "Hyperadrenocorticalism"
      ]
    },
    {
      cui: "C0001723",
      label: "Affective psychosis",
      synonyms: [ ]
    },
    {
      cui: "C0001738",
      label: "Sub-Saharan Africa",
      synonyms: [ ]
    },
    {
      cui: "C0001807",
      label: "Aggressive behaviour",
      synonyms: [ ]
    }
  ],
  conditionsSortFunction =
    function(a, b){
      var
        aScore = a.scoreCount||0,
        bScore = b.scoreCount||0
        ;
      return (
        aScore==bScore ?
        utils.arrayLengthOr0(b.synonyms) - utils.arrayLengthOr0(a.synonyms) :
        bScore - aScore
      );
    }
;

conditions = utils.removeDuplicatesBy(condition=>condition.cui, conditions);

conditions.sort(conditionsSortFunction);

router.get('/conditions', function(req, res, next) {
  res.json(conditions);
});

router.get('/conditions/search', function(req, res, next) {
  var
    searchTerm = req.query.searchTerm,
    results
  ;

  if(searchTerm){
    results = conditions.filter(
      function(condition){
        return (
          utils.containsIgnoreCase(condition.cui, searchTerm) ||
          utils.containsIgnoreCase(condition.label, searchTerm) ||
          (
            condition.synonyms.some(
              function(synonym){
                return utils.containsIgnoreCase(synonym, searchTerm)
              }
            )
          )
        );
      }
    );

    results.forEach(
      function(result){
        result.scoreCount = (result.scoreCount || 0) + 1;
      }
    );

    conditions.sort(conditionsSortFunction);
  }
  else{
    results = conditions.slice(0, 5);
  }

  res.json(results);
});

module.exports = router;
