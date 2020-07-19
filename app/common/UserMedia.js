class UserMedia extends HTMLVideoElement{
    constructor( audio = false, video = true ){
        super( )
        
        this.setAttribute( 'autoplay', 'autoplay' )
        this.setAttribute( 'playsinline', 'playsinline' )
        this.constraints = { audio: audio, video: {width: {exact: 240}}  }

        
    }

    start(){
        navigator.mediaDevices.getUserMedia( this.constraints )
            .then( stream => this.handleSuccess( stream ) )
            .catch( err => this.handleError(err) )
    }

    handleSuccess( stream ) {
        this.classList.add( 'active' )
        this.srcObject = stream
    }
    
    stop(){
        this.srcObject.getTracks().forEach( track => track.stop() )
    }
    
    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') errorMsg(`The resolution is not supported by your device.`)
        else if (error.name === 'PermissionDeniedError') errorMsg('Permissions have not been granted.')
        ( error ) && console.error( error )
    }
}

export { UserMedia as default }