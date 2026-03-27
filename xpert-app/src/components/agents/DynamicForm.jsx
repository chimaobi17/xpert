import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import FileUpload from '../ui/FileUpload';

export default function DynamicForm({ fields, values, onChange, errors }) {
  function handleChange(name, value) {
    onChange({ ...values, [name]: value });
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const error = errors?.[field.name];

        switch (field.type) {
          case 'text':
            return (
              <Input
                key={field.name}
                label={field.label}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                error={error}
                required={field.required}
              />
            );
          case 'textarea':
            return (
              <Textarea
                key={field.name}
                label={field.label}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                error={error}
                required={field.required}
              />
            );
          case 'select':
            return (
              <Select
                key={field.name}
                label={field.label}
                options={field.options || []}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                error={error}
                required={field.required}
              />
            );
          case 'number':
            return (
              <Input
                key={field.name}
                label={field.label}
                type="number"
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                error={error}
                required={field.required}
              />
            );
          case 'file':
            return (
              <FileUpload
                key={field.name}
                label={field.label}
                onFile={(file) => handleChange(field.name, file)}
                accept=".pdf,.docx,.xlsx,.png,.jpg"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
