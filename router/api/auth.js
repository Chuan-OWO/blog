const express = require('express')
const router = express.Router()

const User = require('../../models/usersModel')

//bug user schema大小寫

//註冊 修改 驗證 登入 登出

//用戶註冊
router.post('/register', async (req, res) => {
    const { email,username,password } = req.body;

    try {
        //檢查輸入是否為空
        
        if(!email || !username || !password){
            return res.status(400).json(
            { error: `email不能為空、username不能為空、password不能為空 ` });
        }

        //驗證 email 格式
        function validateEmail(email) {
            // 使用正規表達是驗證格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        if (validateEmail(email)) {
            console.log(`email:${email}格式正確`);
        } else {
            return res.status(400).json({ error: 'email 格式錯誤' });
            // console.log("email格式錯誤");
        }

        //驗證 password 格式
        function validatePassword(password) {
            // 密碼至少包含一個大寫字母、一個小寫字母、一個數字，且長度在8到16之間
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
            return passwordRegex.test(password);
        }
        if (validatePassword(password)) {
            console.log("密碼格是正確");
          } else {
            return res.status(400).json({ error: '密碼至少包含一個大寫字母、一個小寫字母、一個數字，且長度在8到16之間' });
          }

        // 檢查用戶是否存在
        const existingUser = await User.findOne({ email });
            if (existingUser) {

            return res.status(400).json({ error: 'email 已經存在' });
        }
        
        //創建新的User
        // const User = new User({ email,username,password });
        // const User = 
        await User.create({ email,username,password });
        
        // console.log("@@@@",User)
        
        res.status(200).json({ message: '註冊成功' });
        
    } catch (error) {
      res.status(500).json({ error: '註冊失敗' });

    }
  });


//用戶登入
router.post('/login', async (req,res)=>{
    const {email,password} =req.body;
    console.log('@@@@@@@@@@',email,password);

    try {
        
        //資料庫查找該用戶帳密 找到回傳到 user  //.exec方便檢查 
        const user = await User.findOne({email}).exec()
        console.log("$$$$$",user)
        console.log("$$$$$@@@",user._id)

        //檢查登入的Email       
        if(!user){
            return res.status(404).json({error:'輸入的 Email 不存在'})
        }
         
        //檢查登入的密碼
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({error:"密碼不正確"})
        }
        

            
        // res.status(200).json({ token });
        
    } catch (error) {
        res.status(500).json({ error: '登入失敗' });
    }
})



module.exports = router