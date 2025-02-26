import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  return (
    <div className='bg-black pb-20'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='py-8 text-center text-4xl md:text-6xl font-bold tracking-wide bg-gradient-to-r from-purple-500 to-blue-500  bg-clip-text text-transparent'>
            FAQ
          </h2>
        
          
          <div className='space-y-6'>
            <div className='bg-gray-800/50 backdrop-blur-sm rounded-3xl md:rounded-2xl p-4 shadow-md shadow-purple-500/40'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="text-white text-lg md:text-xl p-1 md:p-2">
                    Comment puis-je commencer à utiliser DevGo ?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm md:text-base px-1 md:px-2">
                    Pour commencer, il suffit de créer un compte gratuit sur Github 
                   Ensuite fork le projet
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='bg-gray-800/50 backdrop-blur-sm rounded-3xl md:rounded-2xl p-4 shadow-md shadow-purple-500/40'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-2" className="border-b-0">
                  <AccordionTrigger className="text-white text-lg md:text-xl p-1 md:p-2 ">
                    Quelles Fonctionnalité sont disponible sur DevGo?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm md:text-base px-1 md:px-2">
        
               Système de connexion avec providers et credentials, dashboard admin système de mailing et de payement voir le readme pour plus de détails 
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

           

           

            <div className='bg-gray-800/50 backdrop-blur-sm rounded-3xl md:rounded-2xl p-4 shadow-md shadow-purple-500/40'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-3" className="border-b-0">
                  <AccordionTrigger className="text-white text-lg md:text-xl p-1 md:p-2 ">
                    Des nouvelles fonctionnalités sont prévues ?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm md:text-base px-1 md:px-2">
                 Oui le site est en version 0.6 donc des nouvelles fonctionnalités prévues voir le readme
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='bg-gray-800/50 backdrop-blur-sm rounded-3xl md:rounded-2xl p-4 shadow-md shadow-purple-500/40'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-3" className="border-b-0">
                  <AccordionTrigger className="text-white text-lg md:text-xl p-1 md:p-2 ">
                   Quel est la stack de cette boilerplate ? 
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 text-sm md:text-base px-1 md:px-2">
               NextJS TypeScript AuthJS Nodemailer Stripe Prisma PostgreSQL en autre 
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;