import { IconUpload } from "@douyinfe/semi-icons";
import { Button, Form, Modal } from "@douyinfe/semi-ui";
import { FC } from "react";
import useGetCollections from "./hooks/useGetCollections";

interface IUploadModalProps {
  visible: boolean;
  onClose: () => void;
}

const { Option } = Form.Select;

export const UploadModal: FC<IUploadModalProps> = ({ visible, onClose }) => {
  const fileMap = new Map<string, string>();

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
      <Form>
        <Form.Select
          field="collection"
          label="知识库"
          placeholder="请选择"
          filter
          style={{ width: 300 }}
          allowCreate={true} // 允许创建新知识库
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
          customRequest={({ file, onProgress }) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (file.fileInstance?.name) {
                fileMap.set(file.fileInstance?.name, e.target?.result as string);
              }
              onProgress({ total: 100, loaded: 100 });
            };

            if (file.fileInstance) {
              reader.readAsText(file.fileInstance);
            }
          }}
          accept="text/plain"
        >
          <Button icon={<IconUpload />} theme="light">
            点击上传
          </Button>
        </Form.Upload>
      </Form>
    </Modal>
  );
};
