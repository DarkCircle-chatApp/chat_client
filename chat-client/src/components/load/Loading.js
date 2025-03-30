import {Background, LoadingText} from './Styles';
import Spinner from './spinner.gif';

import React from 'react';

export default () => {
    return (
    <Background>
    <LoadingText>Loading...</LoadingText>
    <img src={Spinner} alt="Loading..." width="5%" />
    </Background>
    );
};
