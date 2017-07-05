import { Modal } from 'antd';

export const ModalConfirm = (title, content, onOk, onCancel, width, iconType, okText, cancelText, maskClosable) => Modal.confirm({
    title: title,
    content: content,
    onOk: onOk,
    okText: '네',
    cancelText: '아니오',
    maskClosable: false,
});

export const ModalInfo = () => Modal.info({
    title: 'Title',
    content: 'ttttt',
    okText: '예',
    cancelText: '아니오',
});

export const ModalError = () => Modal.error({
    title: 'Title',
    content: 'ttttt',
    okText: '예',
    cancelText: '아니오',
});

export const ModalSuccess = () => Modal.success({
    title: 'Title',
    content: 'ttttt',
    okText: '예',
    cancelText: '아니오',
});

export const ModalWarning = () => Modal.warning({
    title: 'Title',
    content: 'ttttt',
    okText: '예',
    cancelText: '아니오',
});
