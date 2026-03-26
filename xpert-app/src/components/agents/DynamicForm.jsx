import { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import FileUpload from '../ui/FileUpload';
import Button from '../ui/Button';

export default function DynamicForm({ fields, onSubmit }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    for (const field of fields) {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(values);
  }

  function renderField(field) {
    switch (field.type) {
      case 'text':
        return (
          <Input
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={errors[field.name]}
          />
        );
      case 'textarea':
        return (
          <Textarea
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={errors[field.name]}
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
            error={errors[field.name]}
          />
        );
      case 'file':
        return (
          <FileUpload
            key={field.name}
            label={field.label}
            accept={field.accept}
            onFile={(file) => handleChange(field.name, file)}
          />
        );
      default:
        return (
          <Input
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={errors[field.name]}
          />
        );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(renderField)}
      <Button type="submit" className="w-full">
        Generate Prompt
      </Button>
    </form>
  );
}
