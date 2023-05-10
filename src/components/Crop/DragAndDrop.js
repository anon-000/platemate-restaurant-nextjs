import React, { Component } from 'react';
import {Box, Typography} from "@mui/material";
// import Translate from '../Translate';
class DragAndDrop extends Component {
    state = {
        drag: false,
    };
    dropRef = React.createRef();
    fileRef = React.createRef();
    handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: true });
    };
    handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: false });
    };
    handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: false });
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if (files && files.length > 0) {
            this.props.handleDrop(files);
            e.dataTransfer.clearData();
        }
    };
    onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        console.log(files);
        const reader = new FileReader();
        reader.onload = () => {
            this.props.handleDrop(files);
        };
        reader.readAsDataURL(files[0]);
    };
    componentDidMount() {
        let div = this.dropRef.current;
        div.addEventListener('dragenter', this.handleDragIn);
        div.addEventListener('dragleave', this.handleDragOut);
        div.addEventListener('dragover', this.handleDrag);
        div.addEventListener('drop', this.handleDrop);
    }
    componentWillUnmount() {
        let div = this.dropRef.current;
        div.removeEventListener('dragenter', this.handleDragIn);
        div.removeEventListener('dragleave', this.handleDragOut);
        div.removeEventListener('dragover', this.handleDrag);
        div.removeEventListener('drop', this.handleDrop);
    }
    render() {
        return (
            <div
                style={{ display: 'inline-block', position: 'relative', cursor: 'pointer' }}
                ref={this.dropRef}
                onClick={() => this.fileRef.current.click()}
            >
                <div
                    style={{
                        border: this.state.drag ? 'dashed black 4px' : 'dashed grey 2px',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '39%',
                            right: 0,
                            left: 0,
                            color: this.state.drag ? 'black' : 'grey',
                        }}
                    >
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            ref={this.fileRef}
                            style={{ display: 'none' }}
                            onChange={this.onChange}
                        />
                        <Typography component={Box} textAlign={'center'} pl={2} pr={2} color={'primary'}>
                            {'Click here to add a image or drag a image'}
                        </Typography>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}
export default DragAndDrop;
