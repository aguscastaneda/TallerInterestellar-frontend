import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, Input } from '../ui';
import { useConfig } from '../../contexts/ConfigContext';

const ProblemSelector = ({ onProblemSelected, onClose }) => {
    const { config } = useConfig();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [customDescription, setCustomDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const repairCategories = config?.repairCategories || [];

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedProblem(null);
        setCustomDescription('');
    };

    const handleProblemSelect = (problem) => {
        setSelectedProblem(problem);
        if (problem.hasDescription) {
            setIsModalOpen(true);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (selectedCategory && selectedProblem) {
            const problemData = {
                category: selectedCategory,
                problem: selectedProblem,
                customDescription: selectedProblem.hasDescription ? customDescription : null
            };
            onProblemSelected(problemData);
            onClose();
        }
    };

    const handleBack = () => {
        if (selectedProblem) {
            setSelectedProblem(null);
            setCustomDescription('');
        } else if (selectedCategory) {
            setSelectedCategory(null);
        }
    };

    const handleModalSubmit = () => {
        if (customDescription.trim() && customDescription.length >= 10) {
            handleSubmit();
            setIsModalOpen(false);
        }
    };

    return (
        <div className="min-h-0 flex flex-col">
            {/* Header con navegación */}
            <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {selectedCategory && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Button>
                        )}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {selectedCategory ? 'Problema específico' : 'Categoría del problema'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {selectedCategory
                                    ? `Selecciona el problema específico en ${selectedCategory.name.toLowerCase()}`
                                    : 'Elige la categoría que mejor describe el problema de tu vehículo'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {!selectedCategory ? (

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {repairCategories.map((category) => (
                            <Card
                                key={category.id}
                                onClick={() => handleCategorySelect(category)}
                                hover
                                className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-102 border border-gray-200 hover:border-blue-300 bg-white"
                            >
                                <CardContent className="p-4 text-center">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {category.problems.length} problemas
                                    </p>
                                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="w-6 h-0.5 bg-blue-500 rounded-full mx-auto"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2 sm:space-y-3">
                        {selectedCategory.problems.map((problem) => (
                            <Card
                                key={problem.id}
                                onClick={() => handleProblemSelect(problem)}
                                hover
                                className="group cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-blue-300 border border-gray-200"
                            >
                                <CardContent className="p-3 sm:p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors flex-shrink-0"></div>
                                            <span className="text-sm sm:text-base text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                                                {problem.name}
                                            </span>
                                        </div>
                                        {problem.hasDescription && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200 font-medium">
                                                    Requiere descripción
                                                </span>
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para descripción personalizada */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
                <ModalHeader onClose={() => setIsModalOpen(false)}>
                    <ModalTitle>
                        Describe el problema específico
                    </ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-semibold text-blue-900">Información útil</h4>
                                    <p className="text-base text-blue-700 leading-relaxed">
                                        Proporciona una descripción detallada del problema para que el mecánico pueda entender mejor la situación.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-base font-semibold text-gray-900">
                                Descripción del problema
                            </label>
                            <textarea
                                placeholder="Ejemplo: El motor hace un ruido extraño cuando acelero, especialmente en segunda marcha..."
                                value={customDescription}
                                onChange={(e) => setCustomDescription(e.target.value)}
                                rows={5}
                                className="w-full p-4 border border-gray-300 rounded-lg resize-vertical min-h-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base leading-relaxed"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span className="font-medium">Mínimo 10 caracteres</span>
                                <span className="font-medium">{customDescription.length}/500</span>
                            </div>
                        </div>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                            className="w-full sm:w-auto px-6 py-3 text-base font-semibold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleModalSubmit}
                            disabled={!customDescription.trim() || customDescription.length < 10}
                            className="w-full sm:w-auto px-6 py-3 text-base font-semibold"
                        >
                            Continuar
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default ProblemSelector;
