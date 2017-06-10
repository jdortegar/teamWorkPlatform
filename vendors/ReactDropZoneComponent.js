import React from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';

export default class Example extends React.Component {
    constructor(props) {
        super(props);

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "image/jpeg,image/png,image/gif",
            maxFilesize: 0.5,   //max filesize = 0.5MB
            maxFiles: 1,
            dictMaxFilesExceeded: 'Only 1 image is accepted!',
            dictFileTooBig: 'Max size is 0.5MB',
            dictCancelUpload: 'Cancel uploading',
            uploadMultiple: false,
        };

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: 'no-url'
        };

        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

        // Simple callbacks work too, of course
        this.callback = () => console.log('Hello!');

        this.success = file => console.log('uploaded', file);

        this.removedfile = file => console.log('removing...', file);

        this.dropzone = null;

        this.maxfilesex = file => console.log('Notification for maxfilesexceeded', file);

        this.maxfilesre = file => console.log('Notification for maxfilesreached', file);
    }

    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;

        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            drop: this.callbackArray,
            addedfile: this.callback,
            success: this.success,
            removedfile: this.removedfile,
            maxfilesexceeded: this.maxfilesex,

        }

        return <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
    }
}