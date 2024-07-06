import { IconUpload } from "@douyinfe/semi-icons";
import { Button, Form, Modal, Toast } from "@douyinfe/semi-ui";
import { FC, useRef, useState } from "react";
import useGetCollections from "./hooks/useGetCollections";
import { splitTextWithOverlap } from "../../utils";
import axios from "axios";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";

interface IUploadModalProps {
  visible: boolean;
  onClose: () => void;
}

const { Option } = Form.Select;

export const UploadModal: FC<IUploadModalProps> = ({ visible, onClose }) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileMap = new Map<string, string[]>();

  const formRef = useRef<FormApi>();

  const collections = useGetCollections();

  return (
    <Modal
      title="上传知识库"
      visible={visible}
      onOk={() => {
        const { collection, fileContent } = formRef.current?.getValues();
        const texts: string[] = [];
        fileContent?.forEach((item: any) => {
          texts.push(...(fileMap.get(item.name) || []));
        });
        setUploadLoading(true);
        axios
          .post("http://127.0.0.1:5000/store_text_embeddings", {
            texts,
            collection_name: collection,
          })
          .then(() => {
            Toast.success("上传知识库成功!");
            setUploadLoading(false);
            onClose?.();
          })
          .catch((err) => {
            Toast.error(err.message);
            setUploadLoading(false);
          });
      }}
      onCancel={onClose}
      okButtonProps={{ loading: uploadLoading }}
    >
      <Form getFormApi={(formApi) => (formRef.current = formApi)}>
        <Form.Select
          field="collection"
          label="知识库"
          placeholder="请选择"
          filter
          style={{ width: 300 }}
          allowCreate={true} // 允许创建新知识库
          rules={[{ required: true, message: "请选择或者填写新建名称知识库" }]}
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
                const contentArr = splitTextWithOverlap(
                  e.target?.result as string,
                  40,
                  10
                );
                fileMap.set(file.fileInstance?.name, contentArr);
              }
              onProgress({ total: 100, loaded: 100 });
            };

            if (file.fileInstance) {
              reader.readAsText(file.fileInstance);
            }
          }}
          accept="text/plain"
          rules={[{ required: true, message: "请上传知识库文件" }]}
        >
          <Button icon={<IconUpload />} theme="light">
            点击上传
          </Button>
        </Form.Upload>
      </Form>
    </Modal>
  );
};
