import React, { useState } from 'react';
import {makeStyles} from "@mui/styles";
import {Box, FormControl, FormHelperText, InputLabel} from "@mui/material";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const useStyles = makeStyles(() => ({
    root: {
        '& .ck.ck-content': {
            minHeight: 230,
        },
    },
}));

const MyCustomUploadAdapterPlugin = (token) =>
    function (editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader, token);
        };
    };

class MyUploadAdapter {
    constructor(props, token) {
        // CKEditor 5's FileLoader instance.
        this.loader = props;
        // URL where to send files.
        this.url = `/api/v1/upload`;
        this.token = token;
    }

    // Starts the upload process.
    upload() {
        return new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject);
            this._sendRequest();
        });
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    // Example implementation using XMLHttpRequest.
    _initRequest() {
        const xhr = (this.xhr = new XMLHttpRequest());

        xhr.open('POST', this.url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Authorization', this.token);
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = "Couldn't upload file:" + ` ${loader.file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            // console.log(response);

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            resolve({
                default: response.link,
            });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', (evt) => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    // Prepares the data and sends the request.
    _sendRequest() {
        const data = new FormData();

        this.loader.file.then((result) => {
            data.append('uri[]', result);
            this.xhr.send(data);
        });
    }
}

function FormQuillElement({ fullWidth, margin, required, label, onChange, value, error, helperText, ...props }) {
    const classes = useStyles();
    const [token, setToken] = useState();

    // React.useEffect(() => {
    //     app.get('authentication').then(({ accessToken }) => setToken(accessToken));
    // }, []);

    if (!token) return 'Loading...';

    return (
        <FormControl className={classes.root} error focused fullWidth={fullWidth} margin={margin} required={required}>
            <InputLabel htmlFor="component-simple">{label}</InputLabel>
            <Box mb={2} mt={2}>
                <CKEditor
                    config={{
                        extraPlugins: [MyCustomUploadAdapterPlugin(token)],
                        heading: {
                            options: [
                                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
                            ],
                        },
                        image: {
                            toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
                        },
                    }}
                    data={value}
                    editor={ClassicEditor}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        onChange({ target: { value: data } });
                    }}
                />
                <FormHelperText>{helperText}</FormHelperText>
            </Box>
        </FormControl>
    );
}

export default FormQuillElement;
