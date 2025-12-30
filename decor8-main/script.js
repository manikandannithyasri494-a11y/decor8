class ARFurnitureViewer {
    constructor() {
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.controller = null;
        this.retical = null;
        this.hitTestSource = null;
        this.currentModel = null;
        this.placedModels = [];
        this.currentMode = 'place'; // place, move, rotate, scale
        this.selectedModel = null;
        this.models = {
            chair: { url: 'models/chair.glb', object: null },
            table: { url: 'models/table.glb', object: null },
            lamp: { url: 'models/lamp.glb', object: null }
        };

        this.init();
    }

    async init() {
        try {
            await this.setupScene();
            this.setupEventListeners();
            this.hideLoadingScreen();
            
            if (!navigator.xr) {
                this.showXRWarning();
                return;
            }
        } catch (error) {
            console.error('Failed to initialize AR experience:', error);
            this.showXRWarning();
        }
    }

    async setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 5, 5).normalize();
        this.scene.add(directionalLight);
        
        // Create reticle
        this.reticle = new THREE.Mesh(
            new THREE.RingGeometry(0.1, 0.11, 32).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        this.reticle.visible = false;
        this.reticle.matrixAutoUpdate = false;
        this.scene.add(this.reticle);
        
        // Load all models
        await this.loadAllModels();
    }

    async loadAllModels() {
        const loader = new THREE.GLTFLoader();
        
        for (const [name, model] of Object.entries(this.models)) {
            try {
                const gltf = await loader.loadAsync(model.url);
                model.object = gltf.scene;
                model.object.visible = false;
                this.scene.add(model.object);
                console.log(`Loaded model: ${name}`);
            } catch (error) {
                console.error(`Failed to load model ${name}:`, error);
            }
        }
    }

    setupEventListeners() {
        // Start AR button
        document.getElementById('start-ar').addEventListener('click', () => {
            this.enterAR();
        });
        
        // Model selection
        document.querySelectorAll('.model-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const modelName = e.currentTarget.dataset.model;
                this.selectModel(modelName);
            });
        });
        
        // Control buttons
        document.getElementById('move-btn').addEventListener('click', () => this.setMode('move'));
        document.getElementById('rotate-btn').addEventListener('click', () => this.setMode('rotate'));
        document.getElementById('scale-btn').addEventListener('click', () => this.setMode('scale'));
        document.getElementById('delete-btn').addEventListener('click', () => this.deleteSelectedModel());
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Touch events for model manipulation
        this.renderer.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.renderer.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.renderer.domElement.addEventListener('touchend', () => this.onTouchEnd());
    }

    async enterAR() {
        try {
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'dom-overlay'],
                domOverlay: { root: document.body }
            });
            
            await this.renderer.xr.setSession(session);
            
            this.showUI();
            this.hideStartButton();
            this.showInstructions();
            
            session.addEventListener('end', () => {
                this.exitAR();
            });
            
            this.animate();
            
        } catch (error) {
            console.error('Failed to start AR session:', error);
            alert('Unable to start AR. Please make sure your device supports AR and you\'re using a compatible browser.');
        }
    }

    exitAR() {
        this.hideUI();
        this.showStartButton();
        this.hideInstructions();
        
        // Clean up placed models
        this.placedModels.forEach(model => {
            this.scene.remove(model);
        });
        this.placedModels = [];
        this.selectedModel = null;
    }

    setMode(mode) {
        this.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${mode}-btn`).classList.add('active');
    }

    selectModel(modelName) {
        this.currentModel = modelName;
        this.setMode('place');
    }

    async handleHitTest(frame, refSpace) {
        if (!this.hitTestSource) {
            this.hitTestSource = await this.renderer.xr.getSession().requestHitTestSource({
                space: refSpace
            });
        }
        
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);
        
        if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            this.reticle.visible = true;
            this.reticle.matrix.fromArray(hit.getPose(refSpace).transform.matrix);
            
            // Place model if in place mode and screen is tapped
            const inputSource = this.renderer.xr.getSession().inputSources[0];
            if (inputSource && inputSource.gamepad && inputSource.gamepad.buttons[0].pressed) {
                this.placeModel();
            }
        } else {
            this.reticle.visible = false;
        }
    }

    placeModel() {
        if (!this.currentModel || !this.models[this.currentModel].object) return;
        
        const modelClone = this.models[this.currentModel].object.clone();
        modelClone.position.setFromMatrixPosition(this.reticle.matrix);
        modelClone.visible = true;
        
        this.scene.add(modelClone);
        this.placedModels.push(modelClone);
        this.selectedModel = modelClone;
    }

    onTouchStart(e) {
        if (!this.selectedModel || this.currentMode === 'place') return;
        
        e.preventDefault();
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.initialModelState = {
            position: this.selectedModel.position.clone(),
            rotation: this.selectedModel.rotation.clone(),
            scale: this.selectedModel.scale.clone()
        };
    }

    onTouchMove(e) {
        if (!this.selectedModel || this.currentMode === 'place') return;
        
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        const deltaX = touchX - this.touchStartX;
        const deltaY = touchY - this.touchStartY;
        
        switch (this.currentMode) {
            case 'move':
                this.selectedModel.position.x = this.initialModelState.position.x + deltaX * 0.01;
                this.selectedModel.position.z = this.initialModelState.position.z - deltaY * 0.01;
                break;
            case 'rotate':
                this.selectedModel.rotation.y = this.initialModelState.rotation.y + deltaX * 0.01;
                break;
            case 'scale':
                const scale = 1 + deltaY * 0.01;
                this.selectedModel.scale.set(scale, scale, scale);
                break;
        }
    }

    onTouchEnd() {
        this.touchStartX = null;
        this.touchStartY = null;
        this.initialModelState = null;
    }

    deleteSelectedModel() {
        if (this.selectedModel) {
            this.scene.remove(this.selectedModel);
            this.placedModels = this.placedModels.filter(model => model !== this.selectedModel);
            this.selectedModel = null;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.renderer.setAnimationLoop((time, frame) => {
            if (frame) {
                const refSpace = this.renderer.xr.getReferenceSpace();
                this.handleHitTest(frame, refSpace);
            }
            
            this.renderer.render(this.scene, this.camera);
        });
    }

    // UI Helper methods
    showUI() {
        document.getElementById('model-selector').classList.add('selector-visible');
        document.getElementById('controls').classList.add('controls-visible');
    }

    hideUI() {
        document.getElementById('model-selector').classList.remove('selector-visible');
        document.getElementById('controls').classList.remove('controls-visible');
    }

    showStartButton() {
        document.getElementById('start-ar').style.display = 'block';
    }

    hideStartButton() {
        document.getElementById('start-ar').style.display = 'none';
    }

    showInstructions() {
        document.getElementById('instructions').classList.add('instructions-visible');
    }

    hideInstructions() {
        document.getElementById('instructions').classList.remove('instructions-visible');
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'none';
    }

    showXRWarning() {
        document.getElementById('xr-warning').classList.add('warning-visible');
    }
}

// Initialize the application when the page loads
window.addEventListener('load', () => {
    new ARFurnitureViewer();
});