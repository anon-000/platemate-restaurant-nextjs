import React from 'react';
import {Skeleton,Box} from "@mui/material";


const MenuSkeleton = () => {
    return (
        <React.Fragment>
            <Box>
                <Box mt={3} />
                <Skeleton style={{marginTop: -17}} height={40} />
                <Skeleton style={{marginTop: -15}} height={70} />
                <Skeleton style={{marginTop: -15}} height={70} />
                <Box mt={2} />
                <Skeleton style={{marginTop: -17}} height={40} />
                <Skeleton style={{marginTop: -15}} height={70} />
                <Skeleton style={{marginTop: -15}} height={70} />
            </Box>
        </React.Fragment>
    );
};

export default MenuSkeleton;
