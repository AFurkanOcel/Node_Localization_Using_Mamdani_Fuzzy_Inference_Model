import  React from 'react';
import { X, Home, Settings, HelpCircle, FileText, Database } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-30 w-64 max-w-xs bg-white transform transition ease-in-out duration-300 md:translate-x-0 md:static md:h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 px-4 h-16">
          <div className="flex items-center">
            <span className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </span>
            <span className="ml-2 text-xl font-semibold text-gray-900">Fuzzy Optimizer</span>
          </div>
          <button
            type="button"
            className="md:hidden h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="px-4 py-4">
            <div className="relative h-32 w-full overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1530916320741-07ac11b52a4d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxmdXp6eSUyMGxvZ2ljJTIwbWVtYmVyc2hpcCUyMGZ1bmN0aW9ucyUyMHZpc3VhbGl6YXRpb24lMjBncmFwaHN8ZW58MHx8fHwxNzQ5MTQ1Nzg4fDA&ixlib=rb-4.1.0&fit=fillmax&h=400&w=600" 
                alt="Fern visualization" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-indigo-700 bg-opacity-30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg font-bold">Fuzzy Systems</span>
              </div>
            </div>
          </div>
          
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <a
              href="#"
              className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
            >
              <Home className="mr-3 h-6 w-6 text-indigo-600" aria-hidden="true" />
              Dashboard
            </a>

            <a
              href="#"
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
            >
              <Database className="mr-3 h-6 w-6 text-gray-400 group-hover:text-indigo-600" aria-hidden="true" />
              Data Manager
            </a>

            <a
              href="#"
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
            >
              <Settings className="mr-3 h-6 w-6 text-gray-400 group-hover:text-indigo-600" aria-hidden="true" />
              Settings
            </a>

            <a
              href="#"
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
            >
              <FileText className="mr-3 h-6 w-6 text-gray-400 group-hover:text-indigo-600" aria-hidden="true" />
              Documentation
            </a>

            <a
              href="#"
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
            >
              <HelpCircle className="mr-3 h-6 w-6 text-gray-400 group-hover:text-indigo-600" aria-hidden="true" />
              Help
            </a>
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Dr. Lotfi Zadeh
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  Fuzzy Logic Scientist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
 