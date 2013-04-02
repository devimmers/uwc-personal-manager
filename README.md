UWC-Personal-Manager
====================
Приложение для управления задачами, событиями и заметками.

Текущая версия: 1.0.0

Документация
====================
Зависимости:
------------
```  
node.js >= 0.8.0
npm >= 1.1.21
mongoDB >= 2.2
```  

Установка и запуск приложения
-----------------------------
Для установки требуеться локальная или удаленная база mongoDB. 
```  
git clone git@github.com:devimmers/uwc-personal-manager.git
cd uwc-personal-manager
npm install
node app.js
```  
Настройка приложения
--------------------

С настройками по умолчанию приложение доступно по адресу http://127.0.0.1:3000/. Изменить порт можно в файле config.js
config.js:
```javascript
  app: {
        url : 'localhost',
        port: 3000,
        mode: 'development',
        version: '1.0.0'
    },
    mongo: {
        adress: 'mongodb://localhost/taskManager'
    },
    facebook: {
        id : '373345199447860',
        secret : 'c00b9931c23bd756dfa1696c2b8e3e90'
    }
```  
Загрузить в архиве
------------------
http://db.tt/LVWLxOkX

