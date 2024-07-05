import { FC } from "react";
import { Button, Form, Modal } from "@douyinfe/semi-ui";
import { IconUpload } from "@douyinfe/semi-icons";
import useGetCollections from "./hooks/useGetCollections";

interface IUploadModalProps {
  visible: boolean;
  onClose: () => void;
}

const { Option } = Form.Select;

export const UploadModal: FC<IUploadModalProps> = ({ visible, onClose }) => {
  const collections = useGetCollections();

  return (
    <Modal
      title="上传知识库"
      visible={visible}
      onOk={() => {
        // 预留，上传逻辑
        onClose?.();
      }}
      onCancel={onClose}
    >
      <Form
        labelPosition="left"
        onSubmit={() => {
          // 预留，提交逻辑
        }}
      >
        <Form.Select
          field="collection"
          label="知识库"
          placeholder="请选择"
          filter
          style={{ width: 200 }}
        >
          {collections.map((item, index) => {
            return (
              <Option value={item} key={index}>
                {item}
              </Option>
            );
          })}
        </Form.Select>
        <Form.Upload
          field="fileContent"
          label="知识库文件(仅支持txt格式)"
          action=""
          multiple
        >
          <Button icon={<IconUpload />} theme="light">
            点击上传
          </Button>
        </Form.Upload>
      </Form>
    </Modal>
  );
};
