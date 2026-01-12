'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ConfigProvider, 
  Typography, 
  Collapse, 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Button, 
  Row, 
  Col, 
  Space, 
  Upload,
  message
} from 'antd';
import { Icon } from '@iconify/react';

// Type untuk Quill instance
interface QuillInstance {
  root: {
    innerHTML: string;
  };
  on: (event: string, handler: () => void) => void;
  getSelection: () => { index: number; length: number } | null;
  setSelection: (selection: { index: number; length: number } | null) => void;
}

interface WindowWithQuill extends Window {
  Quill?: new (element: HTMLElement, options: Record<string, unknown>) => QuillInstance;
}

// Quill Editor Component
const QuillEditor = ({ value, onChange, placeholder }: { value?: string; onChange?: (value: string) => void; placeholder?: string }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const initQuill = useCallback(() => {
    if (!editorRef.current || quillRef.current) return;
    
    const windowWithQuill = window as WindowWithQuill;
    const Quill = windowWithQuill.Quill;
    
    if (Quill && editorRef.current) {
      // Clear any existing content first
      if (editorRef.current.querySelector('.ql-toolbar')) {
        editorRef.current.innerHTML = '';
      }
      
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: placeholder,
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['link'],
            ['clean']
          ],
        },
        formats: ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'indent', 'link']
      });

      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      quillRef.current.on('text-change', () => {
        if (onChange && quillRef.current) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    }
  }, [onChange, placeholder, value]);

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current && editorRef.current && !quillRef.current && !initializedRef.current) {
      initializedRef.current = true;
      
      const windowWithQuill = window as WindowWithQuill;

      // Load Quill CSS
      if (!document.querySelector('link[href="https://cdn.quilljs.com/1.3.7/quill.snow.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
        document.head.appendChild(link);
      }

      // Load Quill JS
      if (windowWithQuill.Quill) {
        // Quill already loaded
        setTimeout(initQuill, 0);
      } else {
        // Load Quill JS
        const existingScript = document.querySelector('script[src="https://cdn.quilljs.com/1.3.7/quill.js"]');
        if (existingScript) {
          if (windowWithQuill.Quill) {
            setTimeout(initQuill, 0);
          } else {
            existingScript.addEventListener('load', initQuill);
          }
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdn.quilljs.com/1.3.7/quill.js';
          script.async = true;
          script.onload = initQuill;
          document.body.appendChild(script);
        }
      }
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [initQuill]);

  useEffect(() => {
    if (quillRef.current && value !== undefined && quillRef.current.root.innerHTML !== value) {
      const selection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = value || '';
      if (selection) {
        quillRef.current.setSelection(selection);
      }
    }
  }, [value]);

  return (
    <div ref={containerRef} className="form-submission-quill-container" style={{ borderRadius: '8px' }}>
      <div ref={editorRef} style={{ minHeight: '150px' }} />
    </div>
  );
};

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const FormSubmissionPage: React.FC = () => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  useEffect(() => {
    if (isEditMode && typeof window !== 'undefined') {
      const editData = localStorage.getItem('editInnovationData');
      if (editData) {
        try {
          const data = JSON.parse(editData);
          form.setFieldsValue({
            title: data.title,
            department: data.department,
            lead: data.lead,
            problem: data.problem,
            solution: data.solution,
            categories: data.categories,
            links: data.links,
          });
        } catch (error) {
          console.error('Error parsing edit data:', error);
        }
      }
    }
  }, [isEditMode, form]);

  const customExpandIcon = ({ isActive }: { isActive?: boolean }) => (
    <Icon 
      icon="lucide:chevron-down" 
      className={`form-submission-text-muted transition-transform duration-300 text-xl text-slate-400 ${isActive ? 'rotate-180' : 'rotate-0'}`}
    />
  );


  const steps = [
    {
      key: '1',
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <Space size={12}>
            <div className="form-submission-icon-bg flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
              <Icon icon="lucide:info" fontSize={18} />
            </div>
            <Text strong className="form-submission-step-label text-base text-slate-800">Basic Information</Text>
          </Space>
          <Text className="form-submission-step-number text-[11px] font-bold text-slate-300 uppercase tracking-widest">Step 1 of 3</Text>
        </div>
      ),
      children: (
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Form.Item 
              label="Project Title" 
              name="title" 
              required 
              rules={[{ required: true, message: 'Please enter project title' }]}
            >
              <Input 
                placeholder="e.g. AI-Powered Traffic Flow Optimization" 
                className="rounded-md"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item 
              label="Department / Entity" 
              name="department" 
              required
              rules={[{ required: true, message: 'Please select department' }]}
            >
              <Select 
                placeholder="Select Department..."
                style={{ borderRadius: 52 }}
                styles={{
                  root: {
                    borderRadius: 62,
                  },
                }}
              >
                <Option value="it">Information Technology</Option>
                <Option value="ops">Operations</Option>
                <Option value="transport">Transport Authority</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Lead Innovator" name="lead">
              <Input 
                placeholder="Ahmed Ali" 
                className="rounded-md"
              />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <Space size={12}>
            <div className="form-submission-icon-bg flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
              <Icon icon="lucide:lightbulb" fontSize={18} />
            </div>
            <Text strong className="form-submission-step-label text-base text-slate-800">Core Idea Description</Text>
          </Space>
          <Text className="form-submission-step-number text-[11px] font-bold text-slate-300 uppercase tracking-widest">Step 2 of 3</Text>
        </div>
      ),
      children: (
        <Space direction="vertical" className="w-full" size={16}>
          <Form.Item 
            label="The Problem Statement" 
            name="problem" 
            required
            rules={[{ required: true, message: 'Please describe the problem statement' }]}
            getValueFromEvent={(value) => value}
            getValueProps={(value) => ({ value: value || '' })}
          >
            <QuillEditor placeholder="Describe the current challenge or pain point..." />
          </Form.Item>
          <Form.Item 
            label="The Proposed Solution" 
            name="solution" 
            required
            rules={[{ required: true, message: 'Please describe the proposed solution' }]}
            getValueFromEvent={(value) => value}
            getValueProps={(value) => ({ value: value || '' })}
          >
            <QuillEditor placeholder="How does your innovation solve this problem?" />
          </Form.Item>
          <Form.Item label="Innovation Categories" name="categories">
            <Select 
              mode="multiple" 
              placeholder="Select categories (e.g., Efficiency, AI, Sustainability)"
              style={{ borderRadius: 12 }}
              styles={{
                root: {
                  borderRadius: 12,
                },
              }}
            >
              <Option value="ai">Artificial Intelligence</Option>
              <Option value="efficiency">Efficiency</Option>
              <Option value="green">Sustainability</Option>
            </Select>
          </Form.Item>
        </Space>
      ),
    },
    {
      key: '3',
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <Space size={12}>
            <div className="form-submission-icon-bg flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
              <Icon icon="lucide:paperclip" fontSize={18} />
            </div>
            <Text strong className="form-submission-step-label text-base text-slate-800">Supporting Materials</Text>
          </Space>
          <Text className="form-submission-step-number text-[11px] font-bold text-slate-300 uppercase tracking-widest">Step 3 of 3</Text>
        </div>
      ),
      children: (
        <Space direction="vertical" className="w-full" size={16}>
          <Form.Item 
            label="Upload Documents (Optional)" 
            name="files"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload.Dragger className="form-submission-upload-area bg-slate-50 border-2 border-dashed border-slate-200 rounded-md">
              <p className="ant-upload-drag-icon">
                <Icon icon="lucide:upload-cloud" fontSize={32} className="form-submission-text-muted text-slate-400 mx-auto" />
              </p>
              <p className="ant-upload-text form-submission-upload-text font-medium text-slate-600">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint form-submission-upload-hint text-slate-400 text-xs">Support for PDF, DOCX, and XLSX files.</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="Related Links" name="links">
            <TextArea 
              rows={3}
              placeholder="Enter links separated by new lines (e.g., https://www.digitaldubai.ae)"
              className="rounded-md"
            />
          </Form.Item>
        </Space>
      ),
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563EB',
          borderRadius: 12,
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Input: {
            borderRadius: 12,
          },
          Select: {
            borderRadius: 12,
          },
          InputNumber: {
            borderRadius: 12,
          },
        },
      }}
    >
      <div className="min-h-screen py-12 px-6 w-auto">
        <div className="max-w-[900px] mx-auto form-submission-container bg-white p-6 rounded-xl w-auto">
          
          {/* Header */}
          <div className="mb-10">
            <Title level={1} className="form-submission-title !text-[32px] !font-bold !m-0 text-slate-900">
              {isEditMode ? 'Edit Innovation Idea' : 'New Innovation Submission'}
            </Title>
            <Paragraph className="form-submission-subtitle text-slate-500 mt-2 text-[15px] leading-relaxed">
              {isEditMode 
                ? 'Update your innovation proposal. Changes will be reviewed and re-scored by our AI system.'
                : 'Submit your innovation proposal for AI-driven scoring. Our system will analyze your submission for feasibility, impact, and alignment with Dubai\'s strategic goals.'}
            </Paragraph>
          </div>

          <Form 
            form={form} 
            layout="vertical"
            initialValues={{
              lead: "Ahmed Ali"
            }}
          >
            
            {/* Steps Accordion */}
            <Collapse 
              defaultActiveKey={['1']} 
              expandIconPosition="end" 
              expandIcon={customExpandIcon}
              className="mb-8"
              items={steps}
            />

            {/* AI Analysis Banner */}
            <div className="form-submission-banner bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <div className="form-submission-banner-icon w-12 h-12 rounded-md bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon icon="lucide:sparkles" className="text-blue-600 text-2xl" />
              </div>
              <div>
                <Text strong className="form-submission-banner-title text-[15px] text-blue-700 block mb-1">AI Scoring Analysis</Text>
                <Paragraph className="form-submission-banner-text text-blue-600/70 text-[13px] m-0 leading-relaxed">
                  Once submitted, our AI engine will analyze your proposal against 15 key innovation metrics including feasibility, scalability, and citizen impact. You will receive a preliminary score within minutes.
                </Paragraph>
              </div>
            </div>

            {/* Certification Checkbox */}
            <div className="form-submission-certification-box bg-white p-6 rounded-2xl border border-slate-100 mb-8 flex items-start gap-4">
              <Form.Item name="certified" valuePropName="checked" className="m-0 pt-1">
                <Checkbox />
              </Form.Item>
              <div>
                <Text strong className="form-submission-certification-text text-sm text-slate-800 block">I certify that this information is accurate and follows data privacy guidelines.</Text>
                <Text className="form-submission-certification-hint text-slate-400 text-[13px]">By submitting, you agree to the innovation handling protocols of Digital Dubai.</Text>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-12">
              <Button className="px-8 shadow-sm">Save Draft</Button>
              <Button 
                type="primary" 
                className="px-8 shadow-lg shadow-blue-100"
                onClick={() => {
                  form.validateFields().then(() => {
                    if (isEditMode) {
                      message.success('Innovation proposal updated successfully!');
                      localStorage.removeItem('editInnovationData');
                    } else {
                      message.success('Innovation proposal submitted successfully!');
                    }
                  });
                }}
              >
                {isEditMode ? 'Update Idea' : 'Submit Idea'} <Icon icon="lucide:send" className="ml-2 inline" />
              </Button>
            </div>

          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default FormSubmissionPage;
