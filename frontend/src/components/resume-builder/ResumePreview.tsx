import {type ResumeData } from './types';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

interface Props {
  data: ResumeData;
  templateId: string;
}

export const ResumePreview = ({ data, templateId }: Props) => {
  switch (templateId) {
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'classic':
      return <ClassicTemplate data={data} />;
    case 'minimal':
      return <MinimalTemplate data={data} />;
    default:
      return <ModernTemplate data={data} />;
  }
};
