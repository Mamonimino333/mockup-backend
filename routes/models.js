
const router = require("express").Router();
const auth = require("../middleware/auth");
const Model = require("../models/model.model");
const SUPABASE =  require("@supabase/supabase-js");

const supabase = SUPABASE.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

router.get('/', async (req, res) => {
  try {
    const models = await Model.find();
    const response = models.map( (model) => {
      return {
        ...model._doc,
        base_image: supabase.storage.from('MockupModels').getPublicUrl(`${model.base_image}`).data.publicUrl,
        mask_image: supabase.storage.from('MockupModels').getPublicUrl(`${model.mask_image}`).data.publicUrl,
      }
    })
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.post("/", auth, async (req, res) => {
  try {
    const base = await supabase.storage.from('MockupModels').upload(`${Date.now()}`, req.files.base.data);
    const mask = await supabase.storage.from('MockupModels').upload(`${Date.now()}`, req.files.mask.data);

    console.log(base, mask);
    const model = new Model({
      base_image: base.data.path,
      mask_image: mask.data.path
    });
    const savedModel = await model.save();
    res.json(savedModel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', /*auth,*/ async (req, res) => {
  const model = await Model.findById(req.params.id);
  if(!model)
      return res.status(400).json({msg: "No model item found !!"});
    
  await supabase.storage.from('MockupModels').remove([`${model.base_image}`, `${model.mask_image}`]);
  const deletedItem = await Model.findByIdAndDelete(req.params.id);
  res.json(deletedItem);
});

router.put('/:id', async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    console.log(model);
    if(!model)
        return res.status(400).json({msg: "No model item found !!"});
    await supabase.storage.from('MockupModels').update(`${model.base_image}`, req.files.base.data);
    await supabase.storage.from('MockupModels').update(`${model.mask_image}`, req.files.mask.data);
    res.json(model);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;