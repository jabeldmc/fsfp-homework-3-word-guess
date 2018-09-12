/*** FUNCTION Array.equals()
***/

if ( Array.prototype.equals ) {
    console.warn( "Overriding existing implementation of `Array.prototype.equals()`." );
}
Array.prototype.equals = function( other ) {
    return (
        ( this.length === other.length ) &&
        this.every(
            ( element , index ) => {
                return element === other[ index ];
            }
        )
    )
}


/*** FUNCTION console.logObject()
***/

if ( console.logObject ) {
    console.warn( "Overriding existing implementation of `console.logObject()`." );
}
console.logObject = function( label , value ) {
    var groupLabel = ( Object.prototype.toString.call( value ) + " " + label );
    console.group( groupLabel );
    if ( typeof value === "object" ) {
        console.log( JSON.parse( JSON.stringify( value ) ) );
    }
    else {
        console.log( value );
    }
    console.groupEnd();
}


/*** FUNCTION getRqndomNumber()
***/

var getRandomNumber = function( cardinality ) {
    var result = ( Math.floor( Math.random() * cardinality ) );
    return result;
}


// export { getRandomNumber };