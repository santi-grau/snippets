var Letter = function( group ){
	this.node = group;
	var rotation = Math.PI * 2 * Math.random();
	this.vector = { x : Math.cos( rotation ), y : Math.sin( rotation ) }
	this.speed = { x : 0, y : 0 };
	this.position = { x : 0, y : 0 };
	this.reset = false;
}

Letter.prototype.positionUpdate = function( i ){
	this.speed.x = this.vector.x * i * 0.5;
	this.speed.y = this.vector.y * i * 0.5;

	var bb = this.node.getBoundingClientRect();

	if( bb.left + this.speed.x < 0 || bb.left + bb.width + this.speed.x > window.innerWidth ) this.vector.x = -this.vector.x;
	if( bb.top + this.speed.y < 0 || bb.top + bb.height + this.speed.y > window.innerHeight ) this.vector.y = -this.vector.y;

	this.speed.x = this.vector.x * i * 0.5;
	this.speed.y = this.vector.y * i * 0.5;

	this.position.x += this.speed.x;
	this.position.y += this.speed.y;
}

Letter.prototype.step = function( ){
	if( this.reset ) {
		this.position.x -= this.position.x * 0.1;
		this.position.y -= this.position.y * 0.1;
	}
	this.node.style.transform = 'translate3d( ' + this.position.x + 'px, ' + this.position.y + 'px, 0px )';
}

var Main = function( ) {
	this.node = document.getElementsByTagName('svg')[0];
	

    document.body.style.height = '10000px'

	var paths = document.getElementsByTagName('path');

	this.lastScroll = window.pageYOffset || document.documentElement.scrollTop;
	this.letters = [];
	this.trailsLength = 50;
	this.trailsTotal = 0;
	this.scrolling = false;

	this.letterGroup = document.createElementNS ( 'http://www.w3.org/2000/svg', 'g');
	this.node.appendChild( this.letterGroup );

	for( var i = paths.length - 1 ; i >= 0 ; i-- ){
		var group = document.createElementNS ( 'http://www.w3.org/2000/svg', 'g');
		group.appendChild( paths[ i ] );
		this.letterGroup.appendChild( group );
		this.letters.push( new Letter( group ) );
	}

	window.addEventListener( 'scroll', this.scroll.bind( this ) );

	this.step();
}

Main.prototype.scroll = function(){
	var top = window.pageYOffset || document.documentElement.scrollTop;
	var scrollInc = this.lastScroll - top;
	for( var i = 0 ; i < this.letters.length ; i++ ) this.letters[i].positionUpdate( scrollInc );
	this.lastScroll = top;

	var node = this.letterGroup;
	this.node.insertBefore( node.cloneNode(true), node );

	while( this.node.childNodes.length > this.trailsLength ) this.node.removeChild( this.node.childNodes[ 0 ] );
	this.trailsTotal = this.node.childNodes.length;

	this.scrolling = true;
	clearTimeout( this.scrollTimeout );
	clearTimeout( this.resetTimeout );
	for( var i = 0 ; i < this.letters.length ; i++ ) this.letters[i].reset = false;
	this.scrollTimeout = setTimeout(function() {
		this.scrolling = false;
		this.resetTimeout = setTimeout( function(){
			for( var i = 0 ; i < this.letters.length ; i++ ) this.letters[i].reset = true;
		}.bind( this ), 1000 );
	}.bind( this ), 66);
}

Main.prototype.step = function( ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	if( !this.scroling ){
		this.trailsTotal -= this.trailsTotal * 0.1;
		var totalTrails = Math.max( Math.ceil( this.trailsTotal ), 1 );
		while( this.node.childNodes.length > totalTrails ) this.node.removeChild( this.node.childNodes[ 0 ] );
	}

	for( var i = 0 ; i < this.letters.length ; i++ ) this.letters[i].step();
};

new Main();