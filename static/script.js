document.addEventListener('DOMContentLoaded', () => {
    // HTMLから要素を取得
    const teamSelector = document.getElementById('teamSelector1');
    const playerSelect = document.getElementById('player-select');
    const typeToggles = document.querySelectorAll('input[name="player_type_toggle"]');
    const hiddenTypeInput = document.getElementById('active-player-type');

    const analysisItemsSelect = document.getElementById('analysisItems');

    // 選手一覧を更新する関数
    function updatePlayers(event) {
        const startYear = document.querySelector('select[name="start_year"]').value;
        const endYear = document.querySelector('select[name="end_year"]').value;
        
    // 現在選択されているタイプ（batter or pitcher) を取得
    const selectedType = document.querySelector('input[name="player_type_toggle"]:checked').value;

    // フォーム送信用の隠しフィールドにも値を同期
    if (hiddenTypeInput) {
        hiddenTypeInput.value = selectedType;
    }
        
    const teamIds = Array.from(
        teamSelector.selectedOptions
    ).map(option => option.value); 

    console.log("JSが取得したチームID:", teamIds, "タイプ:", selectedType);

    if (teamIds.length === 0) {
        playerSelect.innerHTML = '<option value="">先にチームを選択してください</option>';
        return;
    }
        
    playerSelect.innerHTML = '<option>読み込み中...</option>';

    // URLパラメータの構築
    const params = new URLSearchParams();
    teamIds.forEach(team => {
        params.append('team_ids', team);
    });
    params.append('start_year', startYear);
    params.append('end_year', endYear);

    // サーバーに送るパラメータに type を追加
    params.append('player_type', selectedType);

    // サーバーからデータを取得して optgroup でチームごとに区切る
    fetch(`/get_players?${params.toString()}`)
    .then(response => response.json())
    .then(playersGroupList => {
        playerSelect.innerHTML = '<option value="">選手を選択</option>';
            
        //  チームごとにグループ分けして選択肢を組み立てる
        playersGroupList.forEach(group => {
            let optGroup = document.createElement('optgroup');
            optGroup.label = group.team_name; // チーム名をグループの見出しにする
                
            group.player_list.forEach(player => {
                let option = document.createElement('option');
                option.value = player;
                option.textContent = player;
                optGroup.appendChild(option);
            });
                
            playerSelect.appendChild(optGroup);    
        });
    })
    .catch(error => {
        console.error('Error:', error);
        playerSelect.innerHTML = '<option value="">読み込み失敗</option>';
    });
}
    
    // ★この関数を updatePlayers の終わりの } のすぐ下に追加してください
    function updateAnalysisItems(selectedType) {
        if (!analysisItemsSelect) return;
        
        fetch(`/get_items?player_type=${selectedType}`)
        .then(response => response.json())
        .then(items => {
            analysisItemsSelect.innerHTML = '';
            items.forEach(item => {
                let option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                analysisItemsSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('項目取得エラー:', error);
        });
    }
    // イベントリスナーの設定
    if (teamSelector) {
        teamSelector.addEventListener('change', updatePlayers);
    }
    const startYearSelect = document.querySelector('select[name="start_year"]');
    const endYearSelect = document.querySelector('select[name="end_year"]');
    
    if (startYearSelect) startYearSelect.addEventListener('change', updatePlayers);
    if (endYearSelect) endYearSelect.addEventListener('change', updatePlayers);

    // ラジオボタンが切り替わった時も選手を更新する
    typeToggles.forEach(toggle => {
        toggle.addEventListener('change', (event) => {
            const newType = event.target.value;
            // 1. 選手一覧を更新
            updatePlayers(event);
            // 2. 分析項目を更新
            updateAnalysisItems(newType);
        });
    });
});