import templateBranchSurvey from '@/assets/templates/branch-survey';
import templateLinearSurvey from '@/assets/templates/linear-survey';
import templateDefault from '@/assets/templates/scratch';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import { Edge, Node } from '@xyflow/react';
import React, { useState } from 'react';

import CustomModal from '../modal';

interface ModalUpsertInquiryProps {
  open: boolean;

  onSave?: (id: string) => void;
  onClose: () => void;
}

interface Template {
  name: string;
  description: string;
  allowGeneration: boolean;
}

const templates: Template[] = [
  { name: 'Linear Survey', description: 'A simple linear survey of questions.', allowGeneration: true },
  {
    name: 'Branching Survey',
    description: 'A survey with branching logic depending on answers.',
    allowGeneration: true,
  },
  {
    name: 'Open Ended',
    description: 'An open-ended conversation with the user that can go anywhere.',
    allowGeneration: true,
  },
  { name: 'From Scratch', description: 'Start from scratch and build your own inquiry.', allowGeneration: false },
];

function TemplateSelection({ value, onChange }: { value?: Template; onChange?: (template: Template) => void }) {
  return (
    <div className="w-full">
      <RadioGroup value={value} onChange={onChange}>
        <Label className="block text-sm font-bold mb-2">
          Templates
          <br />
          <span className="italic text-slate-500 text-sm font-normal">
            Not sure where to start, select a template to jumpstart your inquiry.
          </span>
        </Label>
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <Radio
              key={template.name}
              value={template}
              className={({ checked }) =>
                `${checked ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                  relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <div className="flex flex-col">
                  <Label as="span" className={`text-lg font-bold  ${checked ? 'text-white' : 'text-gray-800'}`}>
                    {template.name}
                  </Label>
                  <Description as="span" className={`text-sm ${checked ? 'text-indigo-100' : 'text-gray-600'}`}>
                    {template.description}
                  </Description>
                </div>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

export default function ModalUpsertInquiry({ open, onSave, onClose }: ModalUpsertInquiryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);
  const [generateGraph, setGenerateGraph] = useState(false);

  // Hooks
  const { id, form, updateForm, saveForm, saveFormAndGraph, updateGraph } = useInquiryBuilder();
  const alert = useAddAlert();

  /**
   * Handle input change for the form.
   * @param field {string} The field to update.
   * @returns {void} Does not return anything.
   */
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      updateForm({ ...form, [field]: e.target.value });
    };

  const handleChangeGraphTemplate = (template: Template) => {
    setSelectedTemplate(template);
    console.log(template);
    let graph: any = templateDefault;
    switch (template.name) {
      case 'Linear Survey':
        graph = templateLinearSurvey;
        break;
      case 'Branching Survey':
        graph = templateBranchSurvey;
        break;
      default:
        graph = templateDefault;
        break;
    }
    updateGraph(graph);
  };

  const handleCheckboxChange = () => {
    setGenerateGraph(!generateGraph);
  };

  /**
   * Handle saving the inquiry and shows a success or error alert.
   */
  const handleSave = async () => {
    await saveFormAndGraph(
      (id) => {
        alert('Inquiry saved successfully!', 'success');
        if (onSave) onSave(id as string);
      },
      () => {
        alert('Something went wrong!', 'error');
      },
    );
  };

  return (
    <>
      <CustomModal size={'3xl'} open={open} onClose={onClose} title={id ? 'Update Inquiry' : 'Create Inquiry'}>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="title">
              Title
              <br />
              <span className="italic text-slate-500 text-sm font-normal">
                The title of the inquiry that is displayed to the user.
              </span>
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={handleInputChange('title')}
              className="border-2 border-slate-200 p-2 rounded-lg w-full"
            />
          </div>

          {/* todo: List of graph template buttons for linear graph, acyclic graph, cycle graph, start from scratch */}
          <TemplateSelection value={selectedTemplate} onChange={handleChangeGraphTemplate} />

          {selectedTemplate?.allowGeneration && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="generateGraph"
                checked={generateGraph}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="generateGraph" className="text-sm font-bold">
                Generate my graph
              </label>
            </div>
          )}

          {selectedTemplate?.allowGeneration && generateGraph && (
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="goals">
                Goals
                <br />
                <span className="italic text-slate-500 text-sm font-normal">Define the goals for your inquiry.</span>
              </label>
              <input
                type="text"
                id="goals"
                value={form.goals}
                onChange={handleInputChange('goals')}
                className="border-2 border-slate-200 p-2 rounded-lg w-full"
              />
            </div>
          )}
        </form>
        <div className="flex justify-end p-4 rounded-2xl space-x-4">
          <button
            onClick={handleSave}
            disabled={form.title === ''}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center disabled:opacity-50"
          >
            {id ? 'Save' : 'Create'}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
