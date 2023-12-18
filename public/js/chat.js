

const username = localStorage.getItem( 'name' );
if ( !username ) {
  window.location.replace( '/' );
  throw new Error( 'Username is required' );
}

