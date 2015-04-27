(function(){
  window.db=false;
  function createDatabase(){
    var shortName = 'ExampleDB'; //name
    var version = '1.0'; //version
    var displayName = 'ExampleDB'; //display name
    var maxSize = 1048576; //estimatedSize
    db = openDatabase('ExampleDB', '1.0', 'ExampleDB',1048576);

    db.transaction(function(tx){
            tx.executeSql( 'CREATE TABLE IF NOT EXISTS Example(example_id INTEGER NOT NULL PRIMARY KEY, created_on DATE DEFAULT NULL, type TEXT NOT NULL)', [] ,nullHandler,errorHandler);},errorHandler,successCallBack
            );
  }

  function errorHandler(transaction, error) {
    //handle alert for create
  }

  function successCallBack() {
    //handle success for create
  }

  function nullHandler(){
    //handle success for create
  }

  createDatabase();

})()