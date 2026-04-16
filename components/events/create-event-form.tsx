'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Globe, DollarSign, CheckCircle2, Flag, ArrowRight,
  Eye, EyeOff, Camera, X, ImagePlus, MapPin, Sparkles
} from 'lucide-react';
import MarkdownPreview from './markdown-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createEvent, updateEvent } from '@/lib/actions/events';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ImageUploader from './image-uploader';

const ticketTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be 0 or more'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
});

const eventSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  location: z.string().min(3, 'Location is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  galleryImages: z.array(z.string().url()).optional().default([]),
  socialLinks: z.object({
    instagram: z.string().optional(),
    x: z.string().optional(),
    tikTok: z.string().optional(),
    website: z.string().optional(),
  }).optional().default({}),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  ticketTypes: z.array(ticketTypeSchema).min(1, 'Add at least one ticket type'),
});

type EventFormValues = z.infer<typeof eventSchema>;

const STEPS = [
  { id: 'identity', title: 'Identity', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'logistics', title: 'Time & Place', icon: <MapPin className="w-5 h-5" /> },
  { id: 'tickets', title: 'Tickets', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'review', title: 'Review', icon: <Flag className="w-5 h-5" /> },
];

interface CreateEventFormProps {
  eventId?: string;
  initialData?: any;
  onSuccess?: () => void;
}

export default function CreateEventForm({ eventId, initialData, onSuccess }: CreateEventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description || '',
      location: initialData.location,
      startTime: format(new Date(initialData.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(initialData.endTime), "yyyy-MM-dd'T'HH:mm"),
      imageUrl: initialData.imageUrl || '',
      category: initialData.category,
      ticketTypes: initialData.ticketTypes.map((tt: any) => ({
        name: tt.name,
        price: Number(tt.price),
        capacity: tt.capacity
      })),
    } : {
      title: '',
      description: '',
      location: '',
      startTime: '',
      endTime: '',
      imageUrl: '',
      galleryImages: [],
      socialLinks: { instagram: '', x: '', tikTok: '', website: '' },
      locationLat: null,
      locationLng: null,
      category: 'Music',
      ticketTypes: [{ name: 'Regular', price: 10, capacity: 100 }],
    },
  });

  const [previewMode, setPreviewMode] = useState(false);

  const { fields, append, remove } = ({
    fields: form.getValues('ticketTypes'),
    append: (val: any) => {
        const current = form.getValues('ticketTypes');
        form.setValue('ticketTypes', [...current, val]);
    },
    remove: (index: number) => {
        const current = form.getValues('ticketTypes');
        form.setValue('ticketTypes', current.filter((_, i) => i !== index));
    }
  });

  const watchedValues = form.watch();
  const watchedTicketTypes = watchedValues.ticketTypes || [];

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    try {
      const result = eventId 
        ? await updateEvent(eventId, data)
        : await createEvent(data);

      if (result.success) {
        toast.success(eventId ? 'Changes saved successfully' : 'Marketplace launch successful!');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/dashboard`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    } finally {
      setIsLoading(false);
    }
  }

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['title', 'category'];
    if (currentStep === 1) fieldsToValidate = ['location', 'startTime', 'endTime'];
    if (currentStep === 2) fieldsToValidate = ['ticketTypes'];

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const minPrice = watchedTicketTypes.length > 0 
    ? Math.min(...watchedTicketTypes.map(t => t.price))
    : 0;

  return (
    <div className="w-full relative overflow-x-hidden">
      {/* Top Progress Bridge - Static Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-10 border-b border-white/5 mb-12 overflow-hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1 flex flex-col items-center relative group">
               {/* Line Connector */}
               {index < STEPS.length - 1 && (
                 <div className={`absolute left-1/2 right-[-50%] top-5 h-[2px] z-0 transition-colors duration-500 ${index < currentStep ? 'bg-white' : 'bg-white/10'}`} />
               )}
               
               <button
                 type="button"
                 onClick={() => setCurrentStep(index)}
                 className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                   index === currentStep 
                   ? 'bg-white border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                   : index < currentStep 
                   ? 'bg-white border-white' 
                   : 'bg-black border-white/10 text-white/20 hover:border-white/40'
                 }`}
               >
                 {index < currentStep ? (
                   <CheckCircle2 className="w-6 h-6 text-black" />
                 ) : (
                   <span className={`text-xs font-black ${index === currentStep ? 'text-black' : 'text-inherit'}`}>
                     0{index + 1}
                   </span>
                 )}
               </button>
               <span className={`mt-3 text-[9px] font-black uppercase tracking-widest transition-colors ${index <= currentStep ? 'text-white' : 'text-gray-600'}`}>
                 {step.title}
               </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 pb-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Main Focused Form Area */}
          <div className="lg:col-span-12 xl:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Step 0: Identity */}
                {currentStep === 0 && (
                  <div className="space-y-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                       <div className="md:col-span-4 lg:col-span-3 pt-3">
                          <Label className="text-sm font-black text-white uppercase tracking-[0.2em]">Event Name</Label>
                          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter">Your master headline.</p>
                       </div>
                       <div className="md:col-span-8 lg:col-span-9">
                          <Input 
                            {...form.register('title')} 
                            placeholder="e.g. Tunya Festival" 
                            className="bg-black border-white/10 text-white h-16 text-xl font-bold rounded-2xl focus:ring-4 focus:ring-white/10 transition-all px-8"
                          />
                          {form.formState.errors.title && <p className="text-xs text-red-500 mt-2">{form.formState.errors.title.message}</p>}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-white/5 pt-10">
                       <div className="md:col-span-4 lg:col-span-3 pt-3">
                          <Label className="text-sm font-black text-white uppercase tracking-[0.2em]">Visual & Category</Label>
                          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter">Marketplace identity.</p>
                       </div>
                       <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <select
                            {...form.register('category')}
                            className="w-full flex h-16 rounded-2xl border border-white/10 bg-black px-6 text-base text-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all font-bold cursor-pointer"
                          >
                            <option value="Music">Music & Tours</option>
                            <option value="Weddings">Weddings & Socials</option>
                            <option value="Tech">Tech Conferences</option>
                            <option value="Art">Art & Fashion</option>
                            <option value="Food">Food & Drink</option>
                            <option value="Business">Business Networking</option>
                          </select>
                          <ImageUploader 
                            onUploadSuccess={(url) => form.setValue('imageUrl', url)} 
                            currentImage={form.getValues('imageUrl')}
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-white/5 pt-10">
                       <div className="md:col-span-4 lg:col-span-3 pt-3">
                          <Label className="text-sm font-black text-white uppercase tracking-[0.2em]">Narrative</Label>
                          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter">Markdown enabled.</p>
                       </div>
                       <div className="md:col-span-8 lg:col-span-9 space-y-4">
                          <div className="flex items-center gap-4 mb-2">
                             <Button 
                               type="button" 
                               variant="ghost" 
                               size="sm" 
                               onClick={() => setPreviewMode(false)}
                               className={cn("text-[10px] font-black uppercase tracking-widest rounded-lg", !previewMode ? "bg-white text-black" : "text-gray-500")}
                             >
                               Write
                             </Button>
                             <Button 
                               type="button" 
                               variant="ghost" 
                               size="sm" 
                               onClick={() => setPreviewMode(true)}
                               className={cn("text-[10px] font-black uppercase tracking-widest rounded-lg", previewMode ? "bg-white text-black" : "text-gray-500")}
                             >
                               Preview
                             </Button>
                          </div>
                          
                          {previewMode ? (
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 min-h-[200px]">
                              <MarkdownPreview content={form.watch('description') || ''} />
                            </div>
                          ) : (
                            <Textarea 
                              {...form.register('description')} 
                              placeholder="Tell the world why they need to be there... (Use **Markdown** for style)" 
                              className="bg-black border-white/10 text-white min-h-[200px] rounded-2xl p-8 focus:ring-4 focus:ring-white/10 transition-all text-lg leading-relaxed shadow-inner"
                            />
                          )}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-white/5 pt-10">
                       <div className="md:col-span-4 lg:col-span-3 pt-3">
                          <Label className="text-sm font-black text-white uppercase tracking-[0.2em]">Gallery</Label>
                          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter">Immersive visual set.</p>
                       </div>
                       <div className="md:col-span-8 lg:col-span-9 grid grid-cols-2 gap-4">
                          {[0, 1].map((idx) => (
                            <div key={idx} className="relative group/gallery">
                              <Input 
                                placeholder={`Gallery Image URL ${idx + 1}`}
                                className="bg-black border-white/10 text-white h-12 text-xs rounded-xl pr-10"
                                value={form.watch('galleryImages')?.[idx] || ''}
                                onChange={(e) => {
                                  const current = [...(form.getValues('galleryImages') || [])];
                                  current[idx] = e.target.value;
                                  form.setValue('galleryImages', current);
                                }}
                              />
                              <ImagePlus className="absolute right-3 top-3.5 w-4 h-4 text-gray-700" />
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Time & Place */}
                {currentStep === 1 && (
                  <div className="space-y-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                       <div className="md:col-span-4 lg:col-span-3 pt-3">
                          <Label className="text-sm font-black text-white uppercase tracking-[0.2em]">Venue</Label>
                          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter">Physical or Digital.</p>
                       </div>
                       <div className="md:col-span-8 lg:col-span-9">
                          <div className="relative group">
                            <MapPin className="absolute left-6 top-6 w-6 h-6 text-gray-500 group-focus-within:text-white transition-colors" />
                            <Input 
                              {...form.register('location')} 
                              placeholder="e.g. Landmark Centre, VI, Lagos" 
                              className="pl-16 bg-black border-white/10 text-white h-20 text-xl font-bold rounded-2xl focus:ring-4 focus:ring-white/10 transition-all"
                            />
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-white/5 pt-10">
                       <div className="md:col-span-4 lg:col-span-3 pt-3">
                          <Label className="text-sm font-black text-white uppercase tracking-[0.2em]">Scheduling</Label>
                          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter">The door timeline.</p>
                       </div>
                       <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <Label className="text-[10px] text-gray-600 font-black uppercase ml-2">Starts</Label>
                             <Input 
                                type="datetime-local" 
                                {...form.register('startTime')} 
                                className="bg-black border-white/10 text-white [color-scheme:dark] h-16 text-lg font-bold rounded-2xl px-6"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] text-gray-600 font-black uppercase ml-2">Ends</Label>
                             <Input 
                                type="datetime-local" 
                                {...form.register('endTime')} 
                                className="bg-black border-white/10 text-white [color-scheme:dark] h-16 text-lg font-bold rounded-2xl px-6"
                             />
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Tickets (Adaptive invitation labels) */}
                {currentStep === 2 && (
                  <div className="space-y-6 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                       <div>
                         <p className="text-xs font-black uppercase tracking-[0.3em] text-white">
                           {watchedValues.category === 'Weddings' ? 'Guest Access' : 'Commercial Tiers'}
                         </p>
                         <p className="text-[10px] text-gray-500 mt-1 font-bold">
                           {watchedValues.category === 'Weddings' ? 'Define different invitation levels and guest counts.' : 'Manage your inventory and pricing strategy.'}
                         </p>
                       </div>
                       <Button 
                         type="button" 
                         onClick={() => append({ name: '', price: 0, capacity: 100 })}
                         className="bg-white text-black hover:bg-gray-200 h-10 rounded-xl px-5 font-black scale-95 transition-transform"
                       >
                         <Plus className="w-4 h-4 mr-2" /> {watchedValues.category === 'Weddings' ? 'Add Guest Group' : 'Add Tier'}
                       </Button>
                    </div>

                    <div className="overflow-x-auto -mx-4 px-4 custom-scrollbar pb-2">
                      <div className="min-w-[600px] space-y-3">
                        {/* Header for density */}
                        <div className="grid grid-cols-12 gap-4 px-6 text-[9px] font-black uppercase tracking-widest text-gray-600">
                          <div className="col-span-5">Name</div>
                          <div className="col-span-3">Base Price (ZMW)</div>
                          <div className="col-span-3">Stock</div>
                          <div className="col-span-1"></div>
                        </div>

                        {watchedTicketTypes.map((field, index) => (
                          <div key={index} className="grid grid-cols-12 gap-4 p-4 rounded-2xl bg-black border border-white/5 hover:border-white/10 transition-all items-center group">
                            <div className="col-span-5">
                              <Input 
                                {...form.register(`ticketTypes.${index}.name`)} 
                                placeholder="e.g. Regular" 
                                className="bg-transparent border-none text-white h-10 rounded-lg px-2 font-bold focus:ring-1 focus:ring-white/20 w-full"
                              />
                            </div>
                            <div className="col-span-3">
                              <Input 
                                type="number" 
                                {...form.register(`ticketTypes.${index}.price`, { valueAsNumber: true })} 
                                className="bg-transparent border-none text-white h-10 rounded-lg px-2 font-bold focus:ring-1 focus:ring-white/20 w-full"
                              />
                              {watchedTicketTypes[index]?.price > 0 && (
                                <div className="px-2 mt-1">
                                  <p className="text-[9px] font-black text-purple-400/80 uppercase tracking-tighter">
                                    Customer Pays: ZMW {(watchedTicketTypes[index].price * 1.06).toFixed(2)}
                                  </p>
                                  <p className="text-[7px] text-gray-600 uppercase font-bold">
                                    incl. 2.5% comm + 3.5% psp
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="col-span-3">
                              <Input 
                                type="number" 
                                {...form.register(`ticketTypes.${index}.capacity`, { valueAsNumber: true })} 
                                className="bg-transparent border-none text-white h-10 rounded-lg px-2 font-bold focus:ring-1 focus:ring-white/20 w-full"
                              />
                            </div>
                            <div className="col-span-1 flex justify-end">
                               {index > 0 && (
                                 <Button 
                                   type="button" 
                                   variant="ghost" 
                                   size="icon" 
                                   onClick={() => remove(index)}
                                   className="text-gray-700 hover:text-red-500 h-8 w-8 rounded-lg hover:bg-red-500/5 transition-all"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </Button>
                               )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="space-y-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden group">
                     {/* Glossy Backdrop Decor */}
                     <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                     
                     <div className="w-24 h-24 mx-auto rounded-[2.5rem] bg-white text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-8">
                        <ShieldCheck className="w-12 h-12" />
                     </div>
                     <div className="space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tighter">Ready to Deploy</h2>
                        <p className="text-gray-400 max-w-md mx-auto font-medium text-lg leading-relaxed">
                          Your event sequence is ready for launch. Please verify the storefront preview on the right before final deployment.
                        </p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto pt-8">
                        <div className="p-4 rounded-2xl bg-black border border-white/5 text-left space-y-3">
                           <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                             <Camera className="w-3 h-3" /> Instagram Profile
                           </div>
                           <Input 
                             {...form.register('socialLinks.instagram')}
                             placeholder="@handle"
                             className="bg-white/5 border-none h-10 rounded-xl text-xs"
                           />
                        </div>
                        <div className="p-4 rounded-2xl bg-black border border-white/5 text-left space-y-3">
                           <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                             <X className="w-3 h-3" /> X / Twitter Profile
                           </div>
                           <Input 
                             {...form.register('socialLinks.x')}
                             placeholder="@handle"
                             className="bg-white/5 border-none h-10 rounded-xl text-xs"
                           />
                        </div>
                     </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* RHS Marketplace Preview - Adaptive UI */}
          <div className="hidden xl:block xl:col-span-4 sticky top-12 space-y-6">
             <div className="flex items-center gap-3 px-6 pb-2 mb-2 border-b border-white/10">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                  {watchedValues.category === 'Weddings' ? 'Invitation Preview' : 'Market Preview'}
                </span>
             </div>

             <motion.div 
               layout
               className="rounded-[3rem] overflow-hidden bg-black border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] relative"
             >
                <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                   {watchedValues.imageUrl ? (
                     <Image src={watchedValues.imageUrl} alt="Preview" fill className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 font-black uppercase text-xs tracking-widest">
                        Identity Vision
                     </div>
                   )}
                   <div className="absolute top-6 left-6 flex">
                      <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-[10px] font-black text-white uppercase tracking-widest shadow-2xl">
                        {watchedValues.category === 'Weddings' ? 'Celebration' : (watchedValues.category || 'Event')}
                      </span>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                <div className="p-10 space-y-8 relative">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-widest">
                         <Calendar className="w-4 h-4" />
                         {watchedValues.startTime ? format(new Date(watchedValues.startTime), 'EEE, MMM do') : 'TBD'}
                      </div>
                      <h3 className="text-3xl font-black text-white leading-[1.05] tracking-tighter line-clamp-2">
                         {watchedValues.title || 'Perspective Studio'}
                      </h3>
                      <div className="flex items-center gap-2.5 text-sm text-gray-500 font-medium">
                         <MapPin className="w-4 h-4 text-white/40" />
                         <span className="line-clamp-1">{watchedValues.location || 'Signature Destination'}</span>
                      </div>
                   </div>

                   <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                      <div>
                         <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest block mb-0.5">
                           {minPrice === 0 ? 'Access' : 'Starts at'}
                         </span>
                         <span className="text-3xl font-black text-white tracking-tighter">
                           {minPrice === 0 ? 'Free' : `$${minPrice.toLocaleString()}`}
                         </span>
                      </div>
                      <Button disabled className="bg-white text-black h-14 px-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl ml-4">
                         {watchedValues.category === 'Weddings' || minPrice === 0 ? 'RSVP Now' : 'Get Passes'}
                      </Button>
                   </div>
                </div>

                <div className="absolute -bottom-2 -right-2 text-[80px] font-black text-white/[0.02] pointer-events-none italic tracking-tighter select-none">
                  INVITATION
                </div>
             </motion.div>
          </div>
          </div>
        </div>

        {/* Floating PRO Navigation - Strictly Constrained */}
        <div className="fixed bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-2xl border-t border-white/5 py-4 px-10 z-[100] overflow-hidden">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
             <Button 
               type="button" 
               variant="ghost" 
               onClick={handleBack} 
               disabled={currentStep === 0}
               className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-[9px] h-10 px-6 rounded-xl disabled:opacity-0 transition-opacity"
             >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Return
             </Button>

             <div className="hidden lg:flex items-center gap-8">
                <div className="flex gap-1.5">
                   {STEPS.map((_, i) => (
                     <div key={i} className={`h-1 w-8 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10'}`} />
                   ))}
                </div>
             </div>

             {currentStep < STEPS.length - 1 ? (
               <Button 
                 type="button" 
                 onClick={handleNext}
                 className="bg-white hover:bg-gray-100 text-black font-black px-12 h-12 rounded-xl shadow-2xl group transition-all active:scale-95"
               >
                 <div className="flex items-center justify-center gap-3">
                   <span className="text-xs font-black tracking-[0.2em] uppercase">Next Phase</span>
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                 </div>
               </Button>
             ) : (
               <Button 
                 type="submit" 
                 disabled={isLoading}
                 className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-black px-12 h-12 rounded-xl shadow-[0_10px_30px_rgba(147,51,234,0.3)] group transition-all active:scale-95"
               >
                 {isLoading ? (
                   <Loader2 className="h-5 w-5 animate-spin" />
                 ) : (
                    <div className="flex items-center justify-center gap-2">
                       <span className="text-sm font-black uppercase tracking-tighter">
                         {eventId ? 'Save Changes' : 'Publish Studio'}
                       </span>
                       <CheckCircle2 className="w-5 h-5" />
                    </div>
                 )}
               </Button>
             )}
          </div>
        </div>
      </form>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
