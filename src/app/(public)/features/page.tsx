'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiZap, FiTrendingUp, FiShield, FiCloud, FiUsers, FiAward,
  FiEye, FiHeart, FiStar, FiImage
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { featureService, Feature } from '../../services/feature';

// Icon mapping
const iconComponents: { [key: string]: any } = {
  FiZap, FiTrendingUp, FiShield, FiCloud, FiUsers, FiAward, FiEye, FiHeart, FiStar
};

export default function Features() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await featureService.getAllFeatures(true); // true = only active features
      if (response.success && response.data) {
        setFeatures(response.data);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  // Fallback features in case API fails or no features exist
  const fallbackFeatures = [
    {
      id: '1',
      title: "AI-Powered Diagnosis",
      description: "Instant crop disease detection using advanced AI",
      icon: "FiZap",
      color: "from-yellow-500 to-orange-500",
      imageUrl: null,
    },
    {
      id: '2',
      title: "Smart Recommendations",
      description: "Personalized farming advice based on your region",
      icon: "FiTrendingUp",
      color: "from-green-500 to-primary",
      imageUrl: null,
    },
    {
      id: '3',
      title: "Pest Alerts",
      description: "Real-time pest outbreak notifications",
      icon: "FiShield",
      color: "from-red-500 to-pink-500",
      imageUrl: null,
    },
    {
      id: '4',
      title: "Weather Integration",
      description: "Local weather forecasts and crop planning",
      icon: "FiCloud",
      color: "from-blue-500 to-cyan-500",
      imageUrl: null,
    },
    {
      id: '5',
      title: "Farmer Community",
      description: "Connect with experts and fellow farmers",
      icon: "FiUsers",
      color: "from-purple-500 to-indigo-500",
      imageUrl: null,
    },
    {
      id: '6',
      title: "Expert Knowledge",
      description: "Access to verified agricultural research",
      icon: "FiAward",
      color: "from-primary to-green-600",
      imageUrl: null,
    }
  ];

  const displayFeatures = features.length > 0 ? features : fallbackFeatures;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Loading features...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Smart Farming Solutions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Leverage AI technology to transform your farming experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature, index) => {
            const IconComponent = iconComponents[feature.icon] || FiZap;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                onClick={() => toast.success(`Learn more about ${feature.title}`, { icon: "ℹ️" })}
              >
                {/* Image Section - Shows if image exists */}
                {feature.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.imageUrl} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-6">
                  {/* Icon - Only show if no image or show smaller if image exists */}
                  <div className={`${feature.imageUrl ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 shadow-md`}>
                    <IconComponent className="text-white" size={feature.imageUrl ? 24 : 28} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {feature.description}
                  </p>
                  
                  {/* Learn more link */}
                  <div className="mt-4 flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more →
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optional: Show message if no features from API */}
        {features.length === 0 && (
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Using default features. Add custom features in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   FiZap, FiTrendingUp, FiShield, FiCloud, FiUsers, FiAward,
//   FiEye, FiHeart, FiStar
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';
// import { featureService, Feature } from '../../services/feature';

// // Icon mapping
// const iconComponents: { [key: string]: any } = {
//   FiZap, FiTrendingUp, FiShield, FiCloud, FiUsers, FiAward, FiEye, FiHeart, FiStar
// };

// export default function Features() {
//   const [features, setFeatures] = useState<Feature[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchFeatures();
//   }, []);

//   const fetchFeatures = async () => {
//     try {
//       const response = await featureService.getAllFeatures(true); // true = only active features
//       if (response.success && response.data) {
//         setFeatures(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching features:', error);
//       toast.error('Failed to load features');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fallback features in case API fails or no features exist
//   const fallbackFeatures = [
//     {
//       id: '1',
//       title: "AI-Powered Diagnosis",
//       description: "Instant crop disease detection using advanced AI",
//       icon: "FiZap",
//       color: "from-yellow-500 to-orange-500",
//     },
//     {
//       id: '2',
//       title: "Smart Recommendations",
//       description: "Personalized farming advice based on your region",
//       icon: "FiTrendingUp",
//       color: "from-green-500 to-primary",
//     },
//     {
//       id: '3',
//       title: "Pest Alerts",
//       description: "Real-time pest outbreak notifications",
//       icon: "FiShield",
//       color: "from-red-500 to-pink-500",
//     },
//     {
//       id: '4',
//       title: "Weather Integration",
//       description: "Local weather forecasts and crop planning",
//       icon: "FiCloud",
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       id: '5',
//       title: "Farmer Community",
//       description: "Connect with experts and fellow farmers",
//       icon: "FiUsers",
//       color: "from-purple-500 to-indigo-500",
//     },
//     {
//       id: '6',
//       title: "Expert Knowledge",
//       description: "Access to verified agricultural research",
//       icon: "FiAward",
//       color: "from-primary to-green-600",
//     }
//   ];

//   const displayFeatures = features.length > 0 ? features : fallbackFeatures;

//   if (loading) {
//     return (
//       <section className="py-20 bg-white">
//         <div className="container-custom">
//           <div className="text-center">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
//             <p className="text-gray-600">Loading features...</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20 bg-white">
//       <div className="container-custom">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12"
//         >
//           <h2 className="text-4xl font-bold text-primary mb-4">
//             Smart Farming Solutions
//           </h2>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Leverage AI technology to transform your farming experience
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {displayFeatures.map((feature, index) => {
//             const IconComponent = iconComponents[feature.icon] || FiZap;
//             return (
//               <motion.div
//                 key={feature.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ y: -5 }}
//                 className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
//                 onClick={() => toast.success(`Learn more about ${feature.title}`, { icon: "ℹ️" })}
//               >
//                 <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
//                   <IconComponent className="text-white" size={28} />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Optional: Show message if no features from API */}
//         {features.length === 0 && (
//           <div className="text-center mt-8 text-sm text-gray-500">
//             <p>Using default features. Add custom features in the admin panel.</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// // 'use client';

// // import { motion } from 'framer-motion';
// // import { FiZap, FiTrendingUp, FiShield, FiCloud, FiUsers, FiAward } from 'react-icons/fi';
// // import toast from 'react-hot-toast';

// // const features = [
// //   {
// //     icon: FiZap,
// //     title: "AI-Powered Diagnosis",
// //     description: "Instant crop disease detection using advanced AI",
// //     color: "from-yellow-500 to-orange-500",
// //   },
// //   {
// //     icon: FiTrendingUp,
// //     title: "Smart Recommendations",
// //     description: "Personalized farming advice based on your region",
// //     color: "from-green-500 to-green-600",
// //   },
// //   {
// //     icon: FiShield,
// //     title: "Pest Alerts",
// //     description: "Real-time pest outbreak notifications",
// //     color: "from-red-500 to-pink-500",
// //   },
// //   {
// //     icon: FiCloud,
// //     title: "Weather Integration",
// //     description: "Local weather forecasts and crop planning",
// //     color: "from-blue-500 to-cyan-500",
// //   },
// //   {
// //     icon: FiUsers,
// //     title: "Farmer Community",
// //     description: "Connect with experts and fellow farmers",
// //     color: "from-purple-500 to-indigo-500",
// //   },
// //   {
// //     icon: FiAward,
// //     title: "Expert Knowledge",
// //     description: "Access to verified agricultural research",
// //     color: "from-green-600 to-green-700",
// //   },
// // ];

// // export default function Features() {
// //   return (
// //     <section className="py-20 bg-white">
// //       <div className="container-custom">
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6 }}
// //           className="text-center mb-12"
// //         >
// //           <h2 className="text-4xl font-bold text-green-600 mb-4">
// //             Smart Farming Solutions
// //           </h2>
// //           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
// //             Leverage AI technology to transform your farming experience
// //           </p>
// //         </motion.div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {features.map((feature, index) => (
// //             <motion.div
// //               key={index}
// //               initial={{ opacity: 0, y: 30 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //               whileHover={{ y: -5 }}
// //               className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
// //               onClick={() => toast.success(`Learn more about ${feature.title}`, { icon: "ℹ️" })}
// //             >
// //               <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
// //                 <feature.icon className="text-white" size={28} />
// //               </div>
// //               <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
// //               <p className="text-gray-600">{feature.description}</p>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }