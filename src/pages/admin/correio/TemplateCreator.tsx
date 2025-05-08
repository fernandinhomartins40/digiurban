
                        {/* Integrated field creation panel */}
                        <div className="lg:col-span-4">
                          <FieldCreationPanel
                            fields={formFields}
                            onAddField={handleAddField}
                            onUpdateField={handleUpdateField}
                            onRemoveField={remove}
                            onAddPredefinedFields={handleAddPredefinedFields}
                            onFieldDragStart={handleFieldDragStart}
                            onFieldClick={handleFieldClick}
                            existingFieldKeys={getCurrentFieldKeys()}
                            selectedTargetField={selectedTemplateType}
                            onChangeTargetField={setSelectedTemplateType}
                            showPredefinedFields={showPredefinedFields}
                            togglePredefinedFields={togglePredefinedFields}
                          />
                        </div>
