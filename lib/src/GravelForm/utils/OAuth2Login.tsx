import React, { Component, JSX, ReactNode } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from './PopupWindow';
import { toQuery } from './utils';

const responseTypeLocationKeys = {
    code: 'search',
    token: 'hash',
};

const responseTypeDataKeys = {
    code: 'code',
    token: 'access_token',
};


type Props = {

    id?: string,
    authorizationUrl: string,
    clientId: string,
    redirectUri: string,
    responseType: string,
    onSuccess: (data: any) => void,
    onFailure: (data: any) => void,
    buttonText?: string,
    children?: Element,
    popupWidth?: number,
    popupHeight?: number,
    className?: string,
    render?: (data: any) => ReactNode,
    isCrossOrigin?: boolean,
    onRequest?: () => void,
    scope?: string,
    state?: string,
    extraParams?: object,
};
type State = {
    count: number; // like this
};

class OAuth2Login extends Component<Props, State> {

    popup: any

    constructor(props) {
        super(props);
        this.onBtnClick = this.onBtnClick.bind(this);
        this.onRequest = this.onRequest.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onFailure = this.onFailure.bind(this);
    }

    onBtnClick() {
        const {
            buttonText,
            authorizationUrl,
            clientId,
            scope,
            redirectUri,
            state,
            responseType,
            popupWidth,
            popupHeight,
            isCrossOrigin,
            extraParams,
        } = this.props;
        const payload = {
            client_id: clientId,
            scope,
            redirect_uri: redirectUri,
            response_type: responseType,
            ...extraParams,
        };
        if (state) {
            //@ts-ignore
            payload.state = state;
        }
        const search = toQuery(payload);
        const width = popupWidth;
        const height = popupHeight;
        const left = window.screenX + ((window.outerWidth - width) / 2);
        const top = window.screenY + ((window.outerHeight - height) / 2.5);
        const locationKey = responseTypeLocationKeys[responseType];
        const popup = PopupWindow.open(
            buttonText,
            `${authorizationUrl}?${search}`,
            {
                height, width, top, left,
            },
            {
                locationKey,
                isCrossOrigin,
            },
        );
        this.popup = popup;

        this.onRequest();
        popup
            .then(this.onSuccess)
            .catch(this.onFailure);
    }

    onRequest() {
        const { onRequest } = this.props;
        onRequest();
    }

    onSuccess(data) {
        const { responseType, onSuccess, isCrossOrigin } = this.props;
        const responseKey = responseTypeDataKeys[responseType];

        // Cross origin requests will already handle this, let's just return the data
        if (!isCrossOrigin && !data[responseKey]) {
            console.error('received data', data);
            return this.onFailure(new Error(`'${responseKey}' not found in received data`));
        }

        return onSuccess(data);
    }

    onFailure(error) {
        const { onFailure } = this.props;
        onFailure(error);
    }

    render() {
        const {
            id, className, buttonText, children, render,
        } = this.props;

        if (render) {
            return render({
                className, buttonText, children, onClick: this.onBtnClick,
            });
        }
        const attrs: Record<any, any> = { onClick: this.onBtnClick };
        if (id) {
            attrs.id = id;
        }
        if (className) {
            attrs.className = className;
        }
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <button type="button" {...attrs}>{children || buttonText}</button>;
    }
}

//@ts-ignore
OAuth2Login.defaultProps = {
    id: undefined,
    buttonText: 'Login',
    scope: '',
    state: '',
    className: '',
    children: null,
    popupWidth: 680,
    popupHeight: 680,
    render: null,
    isCrossOrigin: false,
    extraParams: {},
    onRequest: () => { },
};

export default OAuth2Login;