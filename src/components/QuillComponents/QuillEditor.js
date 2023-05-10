import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import {Box} from "@mui/material";
import {styled} from "@mui/material/styles";

const Quill = dynamic( () => import('react-quill').then(res => res), {
    ssr: false
});


const QuillRoot = styled(Box)({
    '& .ql-editor': {
        height: 100,
    },
    borderRadius: 5,
});

class QuillEditor extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        toolbar: PropTypes.array,
        value: PropTypes.string,
    };

    constructor(props) {
        super(props)
        // if (document) {
        //     this.quill = import('react-quill');
        // }
    }

    static defaultProps = {
        toolbar: [
            { header: [2, 3, 4, false] },
            'bold',
            'italic',
            'underline',
            'strike',
            { align: [] },
            { list: 'ordered' },
            { list: 'bullet' },
            'link',
            'formula',
        ],
    };

    state = { text: '', quillLoaded: false };

    handleChange = (value) => {
        //  this.setState({ text: value });
        const { onChange } = this.props;
        onChange(value);
    };

    render() {
        // const Quill = this.quill;
        const { value } = this.props;
        const { toolbar } = this.props;
        if (Quill) {
            return (
                <QuillRoot>
                    {Boolean(Quill) && (
                        <Quill
                            modules={{
                                toolbar,
                            }}
                            onChange={this.handleChange}
                            // theme='bubble'
                            theme="snow"
                            value={value}
                        />
                    )}
                </QuillRoot>
            )
        } else {
            return null
        }
    }
}
export default QuillEditor;
