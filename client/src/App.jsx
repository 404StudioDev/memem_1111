@@ .. @@
 import React, { useState, useEffect } from 'react';
 import PropTypes from 'prop-types';
-import { TrendingUp } from 'lucide-react';
+import { TrendingUp, User, LogOut } from 'lucide-react';
+import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
 import MemeGenerator from './components/MemeGenerator';
 import Footer from './components/Footer';
 import AboutPage from './pages/AboutPage';
 import TemplatePage from './pages/TemplatePage';
 import logo from './assets/logo.webp';
 
 function App() {
   const [currentPage, setCurrentPage] = useState('home');
   const [selectedTemplate, setSelectedTemplate] = useState('');
+  const { user } = useUser();
 
   useEffect(() => {
     const handleViewMoreTemplates = () => {
@@ .. @@
             {/* Desktop Nav */}
             <div className="hidden md:flex items-center gap-8">
               {/* Trending Badge */}
-              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold shadow-sm border border-green-200">
-                <TrendingUp className="h-4 w-4 text-green-600" />
-                <span>Trending Now</span>
-              </div>
+              <SignedIn>
+                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold shadow-sm border border-green-200">
+                  <TrendingUp className="h-4 w-4 text-green-600" />
+                  <span>AI Powered</span>
+                </div>
+              </SignedIn>
 
               {/* Navigation */}
               <nav className="flex items-center gap-6">
@@ .. @@
                   </button>
                 ))}
               </nav>
+
+              {/* Auth Section */}
+              <div className="flex items-center gap-4">
+                <SignedOut>
+                  <SignInButton mode="modal">
+                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
+                      <User className="h-4 w-4" />
+                      Sign In
+                    </button>
+                  </SignInButton>
+                </SignedOut>
+                <SignedIn>
+                  <div className="flex items-center gap-3">
+                    <span className="text-sm text-gray-600">
+                      Welcome, {user?.firstName || 'User'}!
+                    </span>
+                    <UserButton 
+                      appearance={{
+                        elements: {
+                          avatarBox: "w-8 h-8"
+                        }
+                      }}
+                    />
+                  </div>
+                </SignedIn>
+              </div>
             </div>
 
             {/* Mobile Menu */}
@@ .. @@
                 </svg>
               </button>
             </div>
           </div>
+
+          {/* Mobile Auth */}
+          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
+            <SignedOut>
+              <SignInButton mode="modal">
+                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
+                  <User className="h-4 w-4" />
+                  Sign In to Access AI Features
+                </button>
+              </SignInButton>
+            </SignedOut>
+            <SignedIn>
+              <div className="flex items-center justify-between">
+                <span className="text-sm text-gray-600">
+                  Welcome, {user?.firstName || 'User'}!
+                </span>
+                <UserButton />
+              </div>
+            </SignedIn>
+          </div>
         </div>
       </header>