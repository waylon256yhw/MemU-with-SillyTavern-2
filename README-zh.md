# MemU �� SillyTavern ����˵��

���ֿ��������� SillyTavern �� MemU ���������������������

- `memu-sillytavern-extension/`��������������˵� React ��չ������ UI�����ã��Լ�������ʱ�ѶԻ����͸� MemU��
- `memu-sillytavern-plugin/`�������� SillyTavern �������˵� Express ������������չ����������ת���� `memu-js`��MemU �ٷ� SDK����

```
SillyTavern UI ���� MemU ��չ ���� SillyTavern ��� ���� MemU �Ʒ���
     ��              ��            ��                    ��
     �� ���������¼� ��            ��                    ��
     �� ׼����ʾ��   ��            �� /api/plugins/memu  ��
     ������������������ �����ܽ� ?�������������ة������������� ������� ����������������
```

## ���Ĺ���

- **�ܽ���������**��`First summary floor` ������������۶�������Ϣ����״��ύ��`Summary interval` ���ƺ���ÿ����������Ϣ�ٴδ�����
- **�ֶ�����**����� ��Summarize now�� ��ť�������ύ��ǰ�Ի������ü�������
- **��ʾ��ע��**���� MemU ���صķ���ժҪ���滻��׷�ӵ� SillyTavern ��ϵͳժҪλ�ã�ȡ�����Ƿ�ѡ ��Override Summarizer������
- **��̨��ѯ**����ʱ��׷������״̬��ʧ��ʱ�Զ����ԣ�����ɹ�����ȡ�������д�뱾�ػ��档
- **���켶״̬**��API Key �ͽ������ñ����� `localStorage`������Ԫ���ݱ����� `chatMetadata.memuExtras`����ͬ��ɫ�������š�

## ��װ����

1. �� `memu-sillytavern-extension/` ���Ƶ� SillyTavern ��װĿ¼�� `public/scripts/extensions/third-party/`���ڸ�Ŀ¼ִ�� `npm install && npm run build`��
2. �� `memu-sillytavern-plugin/` ���Ƶ� `server/plugins/third-party/`���� `server/plugins/memu/`����ͬ��ִ�� `npm install && npm run build`�������� SillyTavern��
3. �� SillyTavern ����չ/���������濪�� MemU ��չ���������� MemU API Key����������ܽ�¥�������
4. ����ʱ�������������̨�鿴 `memu-ext:` ������ڷ������ն˲鿴 `[Memu-SillyTavern-Plugin]` ��־��

## ������ʾ

- `prepareConversationData()` ��� `st.getContext().chat` ת�� MemU ��Ҫ�Ľ�ɫ/�����ṹ��������� UI ��ǣ����ڴ˺�����������ϴ��
- Express �����¶ `/getTaskStatus`��`/getTaskSummaryReady`��`/retrieveDefaultCategories`��`/memorizeConversation` ����·�ɣ�ֱ�Ӹ��� `memu-js` �� `MemuClient`��
- ��������Ŀ������ TypeScript + webpack ���������� Windows ������ȱ�����Ͷ���ı�����Ҫ��װ `@types/express`��`@types/body-parser`��

## ��֪������Ľ�����

- **��Ϣ��ϴ**����ǰ��ֱ�Ӱ����������¼���� MemU�����ܰ���ǰ��װ���Ա�ǩ�����鰴����ӹ����߼���
- **״̬��������**��ʧ����Ϣ���ڿ���̨�ɼ����ɿ��������������������״̬��ʾ��
- **������ʾ**����˷��صĴ���û����ʽ��ʾ���û������� API Key ʧЧ���������ɲ��� UI ��ʾ��
- **��������·��**��webpack ���� `@silly-tavern/*` ����ʱ��Ҫ������ʵ�� SillyTavern ���У����뵥�����������������

��ӭ���ڴ˲ֿ������չ MemU �Ĺ��ܣ��������Ӹ��� MemU API �ĵ��á����� UI ��չʾ�������ݡ�
