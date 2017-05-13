# mobilequery

手机归属地查询node版本

数据来源：<https://github.com/lovedboy/phone>

用法：
```
   const find = require('./find.js');
   let result = find(13800138000);
   /* //返回值：
    { 
          phone: 13800138000,
           op: '移动',
           province: '北京',
           city: '北京',
           zip_code: '100000',
           area_code: '010'
    }
    */
```
