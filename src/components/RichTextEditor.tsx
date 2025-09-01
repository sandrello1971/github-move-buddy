import { Editor } from '@tinymce/tinymce-react';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  id?: string;
}

export const RichTextEditor = ({ value, onChange, label, id }: RichTextEditorProps) => {
  const handleImageUpload = async (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        progress(0);

        // Convert blob to file
        const file = blobInfo.blob();
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          reject('Il file deve essere un\'immagine');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          reject('L\'immagine deve essere più piccola di 5MB');
          return;
        }

        progress(25);

        // Create unique filename
        const fileExt = blobInfo.filename().split('.').pop() || 'jpg';
        const fileName = `editor-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        progress(50);

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        progress(75);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        progress(100);
        resolve(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        reject('Errore nel caricamento dell\'immagine');
      }
    });
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Editor
        id={id}
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "hhhxgf8ved2ogrhp8q2c8c3piiofusg5dextxiawl3t07pm9"}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 400,
          menubar: true,
          onboarding: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'paste', 'importcss', 'autosave', 'save', 'directionality',
            'template', 'codesample', 'textcolor', 'colorpicker', 'imagetools'
          ],
          toolbar: 'undo redo | formatselect | bold italic underline strikethrough | ' +
            'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help | ' +
            'link image media table | code fullscreen',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
          skin: 'oxide',
          content_css: 'default',
          branding: false,
          promotion: false,
          // Enable image uploads
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          paste_data_images: true,
          images_reuse_filename: true,
          // Image dialog options
          image_advtab: true,
          image_caption: true,
          image_description: false,
          setup: (editor) => {
            editor.on('init', () => {
              // Editor is ready
            });
          }
        }}
      />
    </div>
  );
};