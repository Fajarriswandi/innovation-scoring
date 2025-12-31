'use client';

import React, { useState } from 'react';
import { 
  ConfigProvider, 
  Typography, 
  Input, 
  Button, 
  Avatar, 
  Space, 
  Tag, 
  Divider
} from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface InboxItem {
  id: string;
  ref: string;
  title: string;
  snippet: string;
  time: string;
  department: string;
  status: 'Action Required' | 'Pending Review' | 'Resolved';
  deptCode: string;
}

const inboxData: InboxItem[] = [
  {
    id: '1',
    ref: '#DXB-2024-88',
    title: 'Traffic Optimization AI',
    snippet: 'The latest response clarifies the data privacy concerns regarding license plate scanning...',
    time: '2m ago',
    department: 'Roads Authority',
    status: 'Action Required',
    deptCode: 'R',
  },
  {
    id: '2',
    ref: '#DXB-2024-82',
    title: 'Smart Grid Distribution',
    snippet: 'Automated system update: Technical feasibility score has been updated to 85/100.',
    time: '4h ago',
    department: 'DEWA',
    status: 'Pending Review',
    deptCode: 'D',
  },
  {
    id: '3',
    ref: '#DXB-2024-79',
    title: 'AI Health Diagnostics',
    snippet: 'Applicant has requested an extension for the final submission of the ethical compliance report.',
    time: '1d ago',
    department: 'DHA',
    status: 'Pending Review',
    deptCode: 'H',
  },
  {
    id: '4',
    ref: '#DXB-2024-45',
    title: 'Public Park Surveillance',
    snippet: 'Case marked as resolved by Administrator. Final score locked.',
    time: '3d ago',
    department: 'Municipality',
    status: 'Resolved',
    deptCode: 'M',
  },
];

const InboxPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Items');
  const [selectedId, setSelectedId] = useState('1');
  const [replyContent, setReplyContent] = useState('');

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563EB',
          borderRadius: 12,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <div className="flex h-screen bg-white rounded-2xl" style={{  }}>
        
        {/* Left Sidebar: Inbox List */}
        <div className="w-[380px] border-r border-slate-100 flex flex-col">
          <div className="p-6">
            <Title level={2} className="!text-[20px] !font-bold ">Inbox</Title>
            
            <div className="inbox-search mb-3">
              <Input 
                placeholder="Search ID, title, or status..." 
                prefix={<Icon icon="lucide:search" />} 
              />
            </div>

            <div className="flex gap-2">
              {['All Items', 'Action Required', 'Pending'].map((tab) => (
                <Button 
                  key={tab}
                  type={activeTab === tab ? 'primary' : 'text'}
                  className={`!rounded-full px-4 !text-[12px] h-8 ${activeTab !== tab ? 'bg-slate-50 text-slate-500' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-4 pt-1">
            <div className="flex flex-col gap-3 ">
              {inboxData.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 rounded-xl border border-blue-100 cursor-pointer transition-all shadow-md shadow-blue-100  ${
                    selectedId === item.id 
                    ? 'border-blue-500 ring-4 ring-blue-50/50 bg-white' 
                    : 'border-blue-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2 ">
                    <Text className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-xl tracking-wider">
                      {item.ref}
                    </Text>
                    <Text className="text-[11px] text-slate-400 font-medium">{item.time}</Text>
                  </div>
                  <Title level={5} className="!text-[14px] !font-bold !m-0 mb-1.5 text-slate-800">{item.title}</Title>
                  <Paragraph 
                    ellipsis={{ rows: 2 }} 
                    className="text-[13px] text-slate-500 leading-relaxed mb-4 m-0"
                  >
                    {item.snippet}
                  </Paragraph>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar size={20} className="bg-blue-100 text-blue-600 !text-[10px] font-black border border-white shadow-sm">
                        {item.deptCode}
                      </Avatar>
                      <Text className="text-[11px] text-slate-400">{item.department}</Text>
                    </div>
                    <Tag className={`m-0 border-none text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                      item.status === 'Action Required' ? 'bg-amber-50 text-amber-600' :
                      item.status === 'Pending Review' ? 'bg-slate-100 text-slate-500' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {item.status === 'Action Required' && <div className="w-1 h-1 rounded-full bg-amber-500 mr-1" />}
                      {item.status === 'Resolved' && <Icon icon="lucide:check" className="mr-0.5" />}
                      {item.status}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Thread View */}
        <div className="flex-1 flex flex-col bg-[#F8FAFC] rounded-2xl">
          
          {/* Thread Header */}
          <div className="px-5 py-3 flex items-center justify-between bg-white rounded-t-2xl border-b border-slate-100" style={{ zIndex: 200}}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center text-blue-600 border ">
                <Icon icon="lucide:traffic-cone" fontSize={18} />
              </div>
              <div>
                <Title level={3} className="!m-0 !text-[18px] !font-bold text-slate-900 leading-tight">Traffic Optimization AI</Title>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Icon icon="lucide:building-2" fontSize={14} />
                    <Text className="text-xs font-medium">Roads & Transport Authority</Text>
                  </div>
                  <Divider type="vertical" />
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Icon icon="lucide:calendar" fontSize={14} />
                    <Text className="text-xs font-medium">Submitted: Oct 24, 2024</Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-right">
                <Text className="text-[10px] text-slate-400 uppercase block leading-none mb-1">Ref: DXB-2024-88</Text>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <Text className="text-xs text-slate-700">Action Required</Text>
                </div>
              </div>
              <Button className="!rounded-xl px-3 py-5 shadow-sm flex items-center gap-2">
                <Icon icon="lucide:eye" /> View Full Project
              </Button>
              <Button shape="circle" icon={<Icon icon="lucide:more-vertical" />} className="!border-none !bg-transparent text-slate-400" />
            </div>
          </div>

          {/* Chat Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-0">
            <div className="mx-auto space-y-4">
              
              {/* Date Header */}
              <div className="relative text-center">
                <Divider plain><Text className="text-[11px] text-slate-300 uppercase tracking-[0.2em]">Today, Oct 26</Text></Divider>
              </div>

              {/* System Notification */}
              <div className="bg-slate-50 border border-slate-100 rounded-[20px] p-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 border border-slate-50">
                    <Icon icon="lucide:bot" fontSize={20} />
                  </div>
                  <Text className="text-[12px] text-slate-400">System generated: Initial Innovation Score calculated at 78/100</Text>
                </div>
                <Text className="text-[11px]  text-slate-400 uppercase">09:00 AM</Text>
              </div>

              {/* Evaluator Message */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-end gap-3 mb-1">
                  <Text className="text-[11px] text-slate-400 uppercase">09:45 AM</Text>
                  <Text className="text-[14px] text-slate-500">Alex Morgan (Evaluator)</Text>
                  <Avatar src="https://i.pravatar.cc/150?u=alex" size={32} className="border-1 border-white shadow-sm" />
                </div>
                <div className="bg-slate-100 border border-slate-100 rounded-xl p-5 border-l-4 border-l-blue-600 shadow-sm ml-auto max-w-[80%]">
                  <Title level={5} className="!m-0 !text-[14px] !font-bold mb-3 text-slate-800">Request for Clarification</Title>
                  <Paragraph className="text-[14px] text-slate-500 leading-relaxed m-0">
                    I've reviewed the technical submission. Could you please elaborate on how the AI model handles data privacy specifically regarding license plate blurring in real-time? The current documentation in Section 3.2 is vague on the latency impact.
                  </Paragraph>
                </div>
              </div>

              {/* Applicant Message */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                  <Avatar size={32} className="bg-indigo-50 text-indigo-600 !text-[10px] font-black border border-white shadow-sm">RTA</Avatar>
                  <Text className="text-[14px] text-slate-800">Project Lead (Applicant)</Text>
                  <Text className="text-[11px] text-slate-400 uppercase">11:20 AM</Text>
                </div>
                <div className="bg-slate-100 border border-slate-100 rounded-xl p-5 border-l-4 border-l-indigo-500 shadow-sm max-w-[80%]">
                  <Paragraph className="text-[14px] text-slate-500 leading-relaxed mb-6">
                    Thank you for the query, Alex. We utilize edge computing devices installed directly on the traffic cameras to perform the anonymization before data transmission. This ensures zero PII leaves the device.
                  </Paragraph>
                  
                  {/* Attachment */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white border border-slate-100 shadow-sm">
                        <FilePdfOutlined style={{ fontSize: 20 }} />
                      </div>
                      <div>
                        <Text strong className="block text-[14px] text-slate-800">Architecture_Privacy_Spec_v2.pdf</Text>
                        <Text className="text-[12px] text-slate-400 font-medium">2.4 MB • Uploaded today</Text>
                      </div>
                    </div>
                    <Icon icon="lucide:download" className="text-slate-300 group-hover:text-blue-500 transition-colors" fontSize={20} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Reply Area */}
          <div className="p-0 pt-0 bg-transparent">
            <div className="mx-auto bg-white border border-slate-100 shadow-xl overflow-hidden rounded-br-2xl">
              
              {/* Text Area */}
              <div className="px-8 py-6">
                <TextArea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your official response here. This will be visible to the applicant..."
                  variant="borderless"
                  rows={4}
                  className="!p-0  text-slate-800 placeholder:text-slate-300 placeholder:italic leading-relaxed !border-none !shadow-none"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </div>

              {/* Action Footer */}
              <div className="px-8 py-6 bg-slate-50 flex items-center justify-between">
                <Space size={24}>
                  <Button 
                    type="text" 
                    className="!h-12  px-4 text-slate-600 flex items-center gap-2 hover:bg-slate-100"
                  >
                    <Icon icon="lucide:paperclip" fontSize={14} /> Attach File
                  </Button>
                  <Button 
                    type="text" 
                    className="!h-12 !rounded-2xl px-4 text-slate-600 flex items-center gap-2 hover:bg-slate-100"
                  >
                    <Icon icon="lucide:mic" fontSize={14} /> Voice Note
                  </Button>
                </Space>
                <div className="flex items-center gap-3">
                  <Button 
                    className="!h-12 !rounded-2xl px-6 border-slate-200 text-slate-600 flex items-center gap-2 hover:bg-slate-50"
                  >
                    <Icon icon="lucide:check-circle" fontSize={14} /> Mark as Resolved
                  </Button>
                  <Button 
                    type="primary" 
                    className="!h-12 px-10 shadow-lg shadow-blue-100 flex items-center gap-2"
                  >
                    Send Response <Icon icon="lucide:send" fontSize={14} />
                  </Button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
};

export default InboxPage;
