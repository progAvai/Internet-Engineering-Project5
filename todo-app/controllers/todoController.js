// controllers/todoController.js
const Todo = require("../models/Todo");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 20 }); // کش برای 20 ثانیه معتبر است

module.exports.getTodos = async (req, res) => {
    const search = req.query.search || "";
    const status = req.query.status || "";

    const filter = {};
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" }; // جستجوی غیرحساس به بزرگی/کوچکی حروف

    // 1. ساخت کلید منحصر‌به‌فرد برای کش بر اساس فیلترها
    const cacheKey = JSON.stringify(filter);

    // 2. بررسی وجود در کش
    if (cache.has(cacheKey)) {
        console.log("Reading from Cache ⚡");
        return res.render("index", { 
            todos: cache.get(cacheKey), 
            title: "Todos (Cached)",
            search, // فرستادن مقدار سرچ برای پر ماندن اینپوت
            status  // فرستادن وضعیت برای انتخاب ماندن در سلکت
        });
    }

    // 3. اگر در کش نبود، از دیتابیس بخوان
    console.log("Reading from DB 🐢");
    const todos = await Todo.find(filter).sort({ createdAt: -1 });

    // 4. ذخیره در کش
    cache.set(cacheKey, todos);

    res.render("index", { 
        todos, 
        title: "Todo List",
        search,
        status
    });
};

module.exports.addTodo = async (req, res) => {
    if (!req.body.title) return res.redirect("/");
    
    await Todo.create({ title: req.body.title });
    
    // نکته مهم: وقتی داده جدید می‌آید، کش قبلی نامعتبر است
    cache.flushAll(); 
    res.redirect("/");
};

module.exports.deleteTodo = async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    cache.flushAll(); // پاک کردن کش برای دیدن تغییرات
    res.redirect("/");
};

module.exports.editTodoForm = async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    res.render("edit", { todo, title: "Edit Todo" });
};

module.exports.updateTodo = async (req, res) => {
    await Todo.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        status: req.body.status
    });

    cache.flushAll(); // پاک کردن کش
    res.redirect("/");
};